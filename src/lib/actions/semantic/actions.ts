'use server';

import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { randomUUID } from 'crypto';
import { indexSpecCloud, indexSpecRegion, indexName, vectorDimension } from './config';

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

export const getPineconeIndex = async () => {
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

export const getPineconeIndexStats = async () => {
  const index = client.Index(indexName);
  const stats = await index.describeIndexStats();
  return stats;
};

export const deleteNamespace = async (namespace?: string) => {
  const entireIndex = client.Index(indexName);
  const index = namespace ? entireIndex.namespace(namespace) : entireIndex;
  await index.deleteAll();
};

export const updatePineconeIndex = async (unprocessedDocs: Document[], namespace?: string) => {
  const entireIndex = client.Index(indexName);
  const index = namespace ? entireIndex.namespace(namespace) : entireIndex;

  const batchify = (array: PineconeRecord[], batchSize = 100): PineconeRecord[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += batchSize) {
      chunks.push(array.slice(i, i + batchSize));
    }
    return chunks;
  };

  console.log('Processing documents...');
  await Promise.allSettled(
    unprocessedDocs.map(async (unprocessedDoc, index) => {
      const txtPath = unprocessedDoc.metadata.source;
      const text = unprocessedDoc.pageContent;
      const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
      const chunks = await splitter.createDocuments([text]);
      const embeddingsArray = await new OpenAIEmbeddings().embedDocuments(
        chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ' '))
      );
      console.log('Processed', index + 1, 'of', unprocessedDocs.length, 'documents...');
      return chunks.map(
        (chunk, idx) =>
          ({
            id: randomUUID(),
            values: embeddingsArray[idx],
            metadata: {
              ...chunk.metadata,
              loc: JSON.stringify(chunk.metadata.loc),
              pageContent: chunk.pageContent,
              txtPath,
            },
          } as PineconeRecord)
      );
    })
  ).then(async (promises) => {
    const rejected = promises.filter((promise) => promise.status === 'rejected');
    const fulfilledValues = promises.filter((promise) => promise.status !== 'rejected').map((promise) => promise.value);
    const vectors = fulfilledValues.flat();
    const batches = batchify(vectors);
    console.log(vectors.length, 'vectors,', batches.length, 'batches uploading...');
    await Promise.allSettled(batches.map((batch) => index.upsert(batch)));
  });
};

export const queryPineconeStoreAndLLM = async (question: string, namespace?: string) => {
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
    const response = await chain.invoke({
      input_documents: [new Document({ pageContent: concattedPageContent })],
      question,
    });
    console.log(response);
    return response.text;
  } else {
    throw new Error('No matches found');
  }
};
