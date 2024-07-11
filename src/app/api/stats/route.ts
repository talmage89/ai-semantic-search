import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';
import { indexName } from '~/config';
import { getPineconeIndexStats } from '../utils';

export async function POST() {
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

  try {
    const index = await getPineconeIndexStats(client, indexName);
    const response = NextResponse.json({ data: { message: 'Index stats retrieved', index } });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (e) {
    return NextResponse.json({ error: `Error fetching Pinecone index stats: ${e}` }, { status: 500 });
  }
}
