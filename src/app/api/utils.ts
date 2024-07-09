import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { indexSpecCloud, indexSpecRegion } from '~/config';

export const getPineconeIndex = async (client: Pinecone, indexName: string, vectorDimension: number) => {
  const existingIndexes = (await client.listIndexes()).indexes;
  const findIndex = () => existingIndexes?.find((index) => index.name === indexName);
  const createIndex = async () =>
    await client.createIndex({
      name: indexName,
      dimension: vectorDimension,
      metric: 'cosine',
      waitUntilReady: true,
      spec: {
        serverless: {
          cloud: indexSpecCloud,
          region: indexSpecRegion,
        },
      },
    });
  return findIndex() || (await createIndex());
};

export const getPineconeIndexStats = async (client: Pinecone, indexName: string) => {
  const index = client.Index(indexName);
  return index.describeIndexStats();
}

export const updatePineconeIndex = async (client: Pinecone, indexName: string, docs: Document[]) => {
  const index = client.Index(indexName);

  for (const doc of docs) {
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    const batchSize = 100;
    let batch: PineconeRecord[] = [];

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const chunks = await splitter.createDocuments([text]);
    const embeddingsArray = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' '))
    );

    chunks.map((chunk, idx) => {
      const vector: PineconeRecord = {
        id: `${txtPath}-${idx}`,
        values: embeddingsArray[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath,
        },
      };

      batch = [...batch, vector];

      if (batch.length === batchSize || idx === chunks.length - 1) {
        index.upsert(batch);
        batch = [];
      }
    });
  }
};

export const queryPineconeStoreAndLLM = async (client: Pinecone, indexName: string, question: string) => {
  const index = client.Index(indexName);
  const llm = new OpenAI({});
  const chain = loadQAStuffChain(llm);

  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
  const queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });

  if (queryResponse.matches.length) {
    const concattedPageContent = queryResponse.matches.map((match) => match.metadata?.pageContent).join(' ');
    const response = await chain.invoke({
      input_documents: [new Document({ pageContent: concattedPageContent })],
      question,
    });
    return response;
  } else {
    const response = await chain.invoke({ question });
    return `No matches found. GPT-3 response:\n${response}`;
  }
};
