import { Pinecone } from '@pinecone-database/pinecone';
import { NextRequest, NextResponse } from 'next/server';
import { indexName } from '~/config';
import { deleteNamespace } from '../utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

  try {
    await deleteNamespace(client, indexName, body.namespace);
    return NextResponse.json({ data: { message: 'Namespace deleted' } });
  } catch (e) {
    return NextResponse.json({ error: `Error deleting namespace: ${e}` }, { status: 500 });
  }
}
