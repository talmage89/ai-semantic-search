import { NextRequest, NextResponse } from 'next/server';
import { queryPineconeStoreAndLLM } from '~/lib/actions';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const text = await queryPineconeStoreAndLLM(body.question, body.namespace);
    return NextResponse.json({ data: text });
  } catch (e) {
    return NextResponse.json({ error: `Error querying Pinecone index: ${e}` }, { status: 500 });
  }
}
