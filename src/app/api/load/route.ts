import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { indexName } from '~/config';
import { updatePineconeIndex } from '../utils';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

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
    await updatePineconeIndex(client, indexName, processedDocs);
    return NextResponse.json({ data: 'Index updated' });
  } catch (e) {
    return NextResponse.json(`Error creating or updating Pinecone index: ${e}`, { status: 500 });
  }
}
