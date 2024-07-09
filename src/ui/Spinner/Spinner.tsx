import * as React from 'react';
import { clsx } from 'clsx';
import './Spinner.scss';

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const Spinner = (props: SpinnerProps) => {
  return (
    <div className={clsx('Spinner', props.className)}>
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {props.label && <p className="Spinner__label">{props.label}</p>}
    </div>
  );
};
