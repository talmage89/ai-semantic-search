import * as React from 'react';
import clsx from 'clsx';
import { IndexStatsDescription } from '@pinecone-database/pinecone';
import { CheckIcon, ExclamationTriangleIcon, MagicWandIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { IconButton, Spinner, Tooltip } from '~/ui';
import { NamespaceNameDialog } from '..';
import './Sidebar.scss';

type SidebarProps = {
  initialized: boolean;
  loading: boolean;
  uploading: boolean;
  data: IndexStatsDescription | null;
  namespace: string;
  onNamespaceChange: (namespace: string) => void;
  onUpload: (files: File[], namespace?: string) => void;
  onDeleteNamespace: (namespace: string) => void;
};

export const Sidebar = (props: SidebarProps) => {
  const [docs, setDocs] = React.useState<File[]>([]);
  const [editingNamespaces, setEditingNamespaces] = React.useState(false);
  const [namespaceNameDialogOpen, setNamespaceNameDialogOpen] = React.useState(false);

  const directoryUploadRef = React.useRef<HTMLInputElement>(null);
  const fileUploadRef = React.useRef<HTMLInputElement>(null);

  function handleUpload(files: File[], namespace?: string) {
    props.onUpload(files, namespace);
    setDocs([]);
  }

  function renderUninitialized() {
    return (
      <div className="Sidebar__uninitialized">
        <Spinner label="Initializing..." />
      </div>
    );
  }

  function renderLoading() {
    return (
      <div className="Sidebar__loading">
        <Spinner label="Loading namespaces..." />
      </div>
    );
  }

  function renderIndexStats(stats: IndexStatsDescription) {
    const renderNamespace = (namespace: string, recordCount: number, stopEditing?: boolean) =>
      !editingNamespaces ? (
        <div
          key={namespace}
          onClick={() => props.onNamespaceChange(namespace)}
          className={clsx('Sidebar__stats__namespace', {
            'Sidebar__stats__namespace--selected': namespace === props.namespace,
          })}
        >
          <p className="text-size-s text-weight-bold text-color-700">{namespace === '' ? '(Default)' : namespace}</p>
          <p
            className={clsx('text-size-xs text-weight-bold text-color-500', {
              'text-color-600': namespace === props.namespace,
            })}
          >
            {recordCount == 1 ? '1 record' : `${recordCount} records`}
          </p>
        </div>
      ) : (
        <div key={namespace} className="Sidebar__stats__namespace Sidebar__stats__namespace--editing">
          <p className="text-size-s text-weight-bold text-color-700">{namespace === '' ? '(Default)' : namespace}</p>
          <a
            className="Sidebar__dangerLink"
            onClick={() => {
              Object.entries(stats.namespaces || {}).length < 2 && setEditingNamespaces(false);
              props.onDeleteNamespace(namespace);
            }}
          >
            Delete
          </a>
        </div>
      );

    return (
      <div className="Sidebar__stats">
        <div className="flex align-center justify-between mb-2">
          <p className="text-size-l text-weight-bold">Namespaces</p>
          {!editingNamespaces ? (
            <IconButton icon={<MagicWandIcon />} onClick={() => setEditingNamespaces(true)} />
          ) : (
            <IconButton icon={<CheckIcon />} color="success" onClick={() => setEditingNamespaces(false)} />
          )}
        </div>
        <div className="Sidebar__stats__namespaces">
          {stats.namespaces && Object.entries(stats.namespaces).length
            ? Object.entries(stats.namespaces)
                .sort(([ns]) => (ns === '' ? -1 : 1))
                .map(([namespace, count]) => renderNamespace(namespace, count.recordCount))
            : renderNamespace('', 0)}
        </div>
      </div>
    );
  }

  function renderConnectionError() {
    return (
      <div className="Sidebar__error">
        <div className="Sidebar__error__content">
          <ExclamationTriangleIcon className="Sidebar__error__icon" />
          <p className="text-size-m text-color-900">An error has occured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Sidebar">
      <div className="flex flex-column">
        <div className="flex align-center justify-between">
          <h2>Index</h2>
          <Tooltip icon={<QuestionMarkCircledIcon />}>
            <p className="text-size-s text-color-900">
              This is a vector database to which you can upload documents. Your uploaded documents will serve as the
              context for your queries.
            </p>
          </Tooltip>
        </div>
        {props.data && (
          <p className="text-size-xs text-weight-bold text-color-500">{props.data.totalRecordCount} total records</p>
        )}
      </div>
      <div className="Sidebar__content">
        {!props.initialized
          ? renderUninitialized()
          : props.loading
          ? renderLoading()
          : props.data
          ? renderIndexStats(props.data)
          : renderConnectionError()}
      </div>
      <div className="Sidebar__buttons">
        <span className="flex align-center justify-between">
          <p className="text-size-s text-weight-bold">Select</p>
          <span className="flex align-center gap-4">
            <p className="text-size-xs text-weight-bold text-color-500">{docs.length} selected</p>
            {!!docs.length && (
              <a className="Sidebar__dangerLink" onClick={() => setDocs([])}>
                clear
              </a>
            )}
          </span>
        </span>
        <div className="flex align-center gap-2">
          <input
            type="file"
            ref={directoryUploadRef}
            webkitdirectory="true"
            onChange={(e) => {
              e.target.files && setDocs(Array.from(e.target.files));
              e.target.value = '';
            }}
          />
          <input
            type="file"
            ref={fileUploadRef}
            multiple
            onChange={(e) => {
              e.target.files && setDocs(Array.from(e.target.files));
              e.target.value = '';
            }}
          />
          <button className="SidebarButton" onClick={() => directoryUploadRef.current?.click()}>
            Folder
          </button>
          <button className="SidebarButton" onClick={() => fileUploadRef.current?.click()}>
            Files
          </button>
        </div>
        <p className="mt-2 text-size-s text-weight-bold">Upload</p>
        <div className="flex flex-column align-center gap-2">
          <button
            className="SidebarButton SidebarButton--inverse"
            onClick={() => handleUpload(docs, props.namespace)}
            disabled={props.loading || props.uploading || !props.initialized || !props.data || !docs.length}
          >
            {props.uploading
              ? 'Uploading...'
              : !docs.length
              ? 'Upload'
              : docs.length === 1
              ? 'Upload 1 file'
              : `Upload ${docs.length} files`}
          </button>
          <a
            className={clsx('Sidebar__infoLink', {
              'Sidebar__infoLink--disabled':
                props.loading || props.uploading || !props.initialized || !props.data || !docs.length,
            })}
            onClick={() => {
              console.log('opening...');
              if (props.loading || props.uploading || !props.initialized || !props.data || !docs.length) return;
              console.log('opening pasat rentur...');
              setNamespaceNameDialogOpen(true);
            }}
          >
            Upload to new namespace
          </a>
        </div>
      </div>
      <NamespaceNameDialog
        open={namespaceNameDialogOpen}
        onClose={() => setNamespaceNameDialogOpen(false)}
        onSubmit={(name) => handleUpload(docs, name)}
      />
    </div>
  );
};
