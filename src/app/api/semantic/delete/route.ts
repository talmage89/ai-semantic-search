import { NextRequest, NextResponse } from 'next/server';
import { deleteNamespace } from '~/lib/actions';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await deleteNamespace(body.namespace);
    return NextResponse.json({ data: { message: 'Namespace deleted' } });
  } catch (e) {
    return NextResponse.json({ error: `Error deleting namespace: ${e}` }, { status: 500 });
  }
}
