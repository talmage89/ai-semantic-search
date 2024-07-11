import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';
import { indexName, vectorDimension } from '~/config';
import { getPineconeIndex } from '../utils';

export async function POST() {
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

  try {
    const index = await getPineconeIndex(client, indexName, vectorDimension);
    return NextResponse.json({ data: { message: 'Index retrieved', index } });
  } catch (e) {
    return NextResponse.json({ error: `Error creating or updating Pinecone index: ${e}` }, { status: 500 });
  }
}
