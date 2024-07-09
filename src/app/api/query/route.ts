import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { indexName } from '~/config';
import { queryPineconeStoreAndLLM } from '../utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

  try {
    const text = await queryPineconeStoreAndLLM(client, indexName, body.question);
    return NextResponse.json({ data: text });
  } catch (e) {
    return NextResponse.json(`Error querying Pinecone index: ${e}`, { status: 500 });
  }
}
