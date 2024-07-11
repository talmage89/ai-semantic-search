import * as React from 'react';
import { Dialog } from '~/ui';
import './NamespaceNameDialog.scss';

type NamespaceNameDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export const NamespaceNameDialog = (props: NamespaceNameDialogProps) => {
  const [name, setName] = React.useState('');

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName('');
      props.onClose();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    props.onSubmit(name);
    handleOpenChange(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange} className="NamespaceNameDialog">
      <h3 className="mb-4">Enter New Namespace Name</h3>
      <form className="NamespaceNameDialog__input" onSubmit={handleSubmit}>
        <input type="text" placeholder="Namespace 1" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Upload</button>
      </form>
    </Dialog>
  );
};
