'use client';

import * as React from 'react';
import useSWR from 'swr';
import { logout } from '~/lib/actions';
import { Chat, QuestionInput, Sidebar } from './components';
import { ErrorMessage, Message } from './types';
import './page.scss';

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export const Home = () => {
  const [indexInitialized, setIndexInitialized] = React.useState(false);
  const [uploadingFiles, setUploadingFiles] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [sendingMessage, setSendingMessage] = React.useState(false);

  const [conversation, setConversation] = React.useState<(Message | ErrorMessage)[]>([]);
  const [namespace, setNamespace] = React.useState('');

  const { data, isLoading, error, mutate } = useSWR(
    indexInitialized ? '/api/semantic/stats' : null,
    (url: string | URL | Request) => fetcher(url, { method: 'POST' })
  );

  React.useEffect(() => {
    fetch('/api/semantic/initialize', { method: 'POST' })
      .catch(console.error)
      .finally(() => setIndexInitialized(true));
  }, []);

  React.useEffect(() => {
    const namespaces = data?.data.index.namespaces;
    if (namespaces && !namespaces?.[namespace]) {
      setNamespace(Object.keys(namespaces)[0] || '');
    }
  }, [data, namespace]);

  function handleUploadFiles(docs: File[], namespace?: string) {
    const formData = new FormData();
    namespace && formData.append('namespace', namespace);
    docs.forEach((file) => formData.append('documents', file));
    setUploadingFiles(true);
    fetch('/api/semantic/upload', { method: 'POST', body: formData })
      .then(async () => await handleAwaitIndexUpdate(namespace))
      .catch(console.error)
      .finally(() => setUploadingFiles(false));
  }

  function handleAwaitIndexUpdate(namespace = '', shouldIncludeNamespace = true) {
    return new Promise<void>((resolve, reject) => {
      let count = 0;
      const countLimit = 10;
      const interval = setInterval(() => {
        mutate().then((res) => {
          const index = res.data?.index;
          const namespaceIncluded = index?.namespaces?.[namespace || ''];
          if (
            index?.namespaces &&
            ((shouldIncludeNamespace && namespaceIncluded) || (!shouldIncludeNamespace && !namespaceIncluded))
          ) {
            clearInterval(interval);
            resolve();
          } else {
            count++;
            if (count >= countLimit) {
              clearInterval(interval);
              reject('Index not updated');
            }
          }
        });
      }, 1000);
    });
  }

  const addMessage = (message: Message | ErrorMessage) => setConversation((prev) => [...prev, message]);

  function handleQuestion(question: string) {
    // setConversation((prev) => [...prev, { text: question, timestamp: new Date(), direction: 'outgoing' } as Message]);
    addMessage({ text: question, timestamp: new Date(), direction: 'outgoing' });
    setSendingMessage(true);
    fetch(`/api/semantic/query`, { method: 'post', body: JSON.stringify({ question, namespace }) })
      .then((res) => res.json())
      .then((json) => {
        json.error
          ? addMessage({ error: new Error(json.error), timestamp: new Date() })
          : addMessage({ text: json.data.trim(), timestamp: new Date(), direction: 'incoming' });
      })
      .catch((err) => addMessage({ error: new Error(err), timestamp: new Date() }))
      .finally(() => setSendingMessage(false));
  }

  function handleDeleteNamespace(namespace: string) {
    setDeleting(true);
    fetch('/api/semantic/delete', { method: 'POST', body: JSON.stringify({ namespace }) })
      .then(() => handleAwaitIndexUpdate(namespace, false))
      .catch(console.error)
      .finally(() => setDeleting(false));
  }

  return (
    <div className="Home">
      <Sidebar
        initialized={indexInitialized}
        loading={isLoading || deleting}
        uploading={uploadingFiles}
        data={error || data?.data.index}
        namespace={namespace}
        onNamespaceChange={(namespace) => setNamespace(namespace)}
        onDeleteNamespace={(namespace) => handleDeleteNamespace(namespace)}
        onUpload={(docs, namespace) => handleUploadFiles(docs, namespace)}
      />
      <div className="Home__main">
        <div className="Home__main__header">
          <div className="flex flex-column">
            <h2 className="text-color-900">Semantic Search</h2>
            {/* <div className="text-size-xs text-weight-bold text-color-500">Version {process.env.npm_package_version}</div> */}
          </div>
          <button onClick={() => logout()}>Log out</button>
        </div>
        <div className="Home__main__scroll">
          <div className="Home__main__container">
            <Chat conversation={conversation} />
          </div>
        </div>
        <div className="Home__main__container">
          <QuestionInput onSubmit={(message) => handleQuestion(message)} />
        </div>
      </div>
    </div>
  );
};

export default Home;
