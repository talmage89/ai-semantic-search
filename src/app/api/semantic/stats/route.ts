import { NextResponse } from 'next/server';
import { getPineconeIndexStats } from '~/lib/actions';

export async function POST() {
  try {
    const index = await getPineconeIndexStats();
    const response = NextResponse.json({ data: { message: 'Index stats retrieved', index } });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (e) {
    return NextResponse.json({ error: `Error fetching Pinecone index stats: ${e}` }, { status: 500 });
  }
}
