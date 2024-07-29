import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { NextRequest, NextResponse } from 'next/server';
import { updatePineconeIndex } from '~/lib/actions';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  if (!formData.get('documents')) {
    return NextResponse.json('No documents found in request', { status: 400 });
  }

  const docs = Array.from(formData.getAll('documents'));
  const textDocs = docs.filter((doc) => (doc as File).type === 'text/plain');
  const pdfDocs = docs.filter((doc) => (doc as File).type === 'application/pdf');
  const processedDocs = (
    await Promise.all([
      ...textDocs.map((doc) => new TextLoader(doc as File).load()),
      ...pdfDocs.map((doc) => new PDFLoader(doc as File).load()),
    ])
  ).flat();

  try {
    await updatePineconeIndex(processedDocs, (formData.get('namespace') as string) || undefined);
    return NextResponse.json({ data: 'Index updated' });
  } catch (e) {
    return NextResponse.json({ error: `Error updating Pinecone index: ${e}` }, { status: 500 });
  }
}
