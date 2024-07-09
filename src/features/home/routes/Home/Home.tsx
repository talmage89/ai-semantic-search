'use client';
import * as React from 'react';
import './Home.scss';
import { Sidebar } from '../../components';

export const Home = () => {
  const [question, setQuestion] = React.useState<string>('');
  const [docs, setDocs] = React.useState<File[]>([]);
  const [indexInitialized, setIndexInitialized] = React.useState(false);
  const [updatingIndex, setUpdatingIndex] = React.useState(false);

  const directoryUploadRef = React.useRef<HTMLInputElement>(null);
  const fileUploadRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    initialize()
      .catch(console.error)
      .finally(() => setIndexInitialized(true));
  }, []);

  async function initialize() {
    return fetch('/api/initialize', { method: 'POST' });
  }

  async function updateIndex(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    return fetch('/api/setup', { method: 'POST', body: formData });
  }

  function processFiles() {
    setUpdatingIndex(true);
    updateIndex(docs)
      .catch(console.error)
      .finally(() => setUpdatingIndex(false));
  }

  function renderIndexStatus() {
    if (!indexInitialized) {
      return <div className="IndexStatus">Initializing index...</div>;
    }

    return <div className="IndexStatus"></div>;
  }

  return (
    <div className="Home">
      <Sidebar initialized={indexInitialized} loading={updatingIndex} data={null} />
      <div className="Home__text">
        <h1>Welcome to the Semantic Search App</h1>
        <p>Query uploaded documents via a semantic LLM.</p>
      </div>
      <div className="Home__interactive">
        <div className="Home__question__container">
          <input
            className="Home__question__input"
            type="text"
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="Home__question__button">Submit</button>
        </div>
        <input
          type="file"
          ref={directoryUploadRef}
          webkitdirectory="true"
          onChange={(e) => {
            e.target.files && setDocs(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
        <button className="Home__fileUpload" onClick={() => directoryUploadRef.current?.click()}>
          Upload a folder
        </button>
        <input
          type="file"
          ref={fileUploadRef}
          multiple
          onChange={(e) => {
            e.target.files && setDocs(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
        <button className="Home__fileUpload" onClick={() => fileUploadRef.current?.click()}>
          Upload files
        </button>
        <button onClick={() => processFiles()} disabled={!docs.length}>
          Process files
        </button>
      </div>
      <div className="Home__output">
        <h2>Output</h2>
        <p>Output will appear here</p>
      </div>
    </div>
  );
};
