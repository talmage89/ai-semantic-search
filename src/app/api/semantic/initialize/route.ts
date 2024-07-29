import { NextResponse } from 'next/server';
import { getPineconeIndex } from '~/lib/actions';

export async function POST() {

  try {
    const index = await getPineconeIndex();
    return NextResponse.json({ data: { message: 'Index retrieved', index } });
  } catch (e) {
    return NextResponse.json({ error: `Error creating or updating Pinecone index: ${e}` }, { status: 500 });
  }
}
