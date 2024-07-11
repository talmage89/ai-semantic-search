import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { indexSpecCloud, indexSpecRegion } from '~/config';
import { randomUUID } from 'crypto';

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
  const stats = await index.describeIndexStats();
  return stats;
};

export const deleteNamespace = async (client: Pinecone, indexName: string, namespace?: string) => {
  const entireIndex = client.Index(indexName);
  const index = namespace ? entireIndex.namespace(namespace) : entireIndex;
  await index.deleteAll();
};

export const updatePineconeIndex = async (
  client: Pinecone,
  indexName: string,
  unprocessedDocs: Document[],
  namespace?: string
) => {
  const entireIndex = client.Index(indexName);
  const index = namespace ? entireIndex.namespace(namespace) : entireIndex;
  let allVectors: PineconeRecord[] = [];

  const batchify = (array: PineconeRecord[], batchSize = 100): PineconeRecord[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += batchSize) {
      chunks.push(array.slice(i, i + batchSize));
    }
    return chunks;
  };

  await Promise.all(
    unprocessedDocs.map(async (unprocessedDoc) => {
      const txtPath = unprocessedDoc.metadata.source;
      const text = unprocessedDoc.pageContent;
      const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
      const chunks = await splitter.createDocuments([text]);
      const embeddingsArray = await new OpenAIEmbeddings().embedDocuments(
        chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' '))
      );
      const vectors: PineconeRecord[] = chunks.map((chunk, idx) => {
        return {
          id: randomUUID(),
          values: embeddingsArray[idx],
          metadata: {
            ...chunk.metadata,
            loc: JSON.stringify(chunk.metadata.loc),
            pageContent: chunk.pageContent,
            txtPath,
          },
        };
      });
      allVectors = [...allVectors, ...vectors];
    })
  );
  const batches = batchify(allVectors);
  await Promise.all(batches.map((batch) => index.upsert(batch)));
};

export const queryPineconeStoreAndLLM = async (
  client: Pinecone,
  indexName: string,
  question: string,
  namespace?: string
) => {
  const entireIndex = client.Index(indexName);
  const index = namespace ? entireIndex.namespace(namespace) : entireIndex;
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
    console.log(concattedPageContent);
    const response = await chain.invoke({
      input_documents: [new Document({ pageContent: concattedPageContent })],
      question,
    });
    return response.text;
  } else {
    throw new Error('No matches found');
  }
};
