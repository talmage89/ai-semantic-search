import clsx from 'clsx';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './Dialog.scss';
import { IconButton } from '../IconButton/IconButton';

export type DialogProps = {
  asDrawer?: boolean;
  children?: React.ReactNode;
  className?: string;
  close?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  overlay?: boolean;
  portal?: boolean;
  trigger?: React.ReactNode;
  triggerAsChild?: boolean;
};

export const Dialog = ({
  asDrawer,
  className,
  children,
  close = true,
  open,
  onOpenChange,
  overlay = true,
  portal = true,
  trigger,
  triggerAsChild = true,
}: DialogProps) => {
  const dialogContent = (
    <>
      <RadixDialog.Title />
      {overlay && (
        <RadixDialog.Overlay
          className={clsx({
            Dialog__overlay: !asDrawer,
            Drawer__overlay: asDrawer,
          })}
        />
      )}
      <RadixDialog.Content
        aria-describedby={undefined}
        className={clsx(
          {
            Dialog__content: !asDrawer,
            Drawer__content: asDrawer,
          },
          className
        )}
      >
        {close && (
          <RadixDialog.Close
            asChild
            className={clsx({
              Dialog__close: !asDrawer,
              Drawer__close: asDrawer,
            })}
          >
            <IconButton icon={<Cross2Icon />} />
          </RadixDialog.Close>
        )}
        {children}
      </RadixDialog.Content>
    </>
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild={triggerAsChild}>{trigger}</RadixDialog.Trigger>}
      {portal ? <RadixDialog.Portal>{dialogContent}</RadixDialog.Portal> : dialogContent}
    </RadixDialog.Root>
  );
};
