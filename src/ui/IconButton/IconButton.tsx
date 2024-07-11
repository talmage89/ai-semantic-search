import * as React from 'react';
import clsx from 'clsx';
import './IconButton.scss';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  color?: 'default' | 'inverse' | 'info' | 'danger' | 'success';
};

export const IconButton = ({ icon, className, color = 'default', ...props }: IconButtonProps) => {
  return (
    <button
      className={clsx('IconButton', className, {
        'IconButton--inverse': color === 'inverse',
        'IconButton--info': color === 'info',
        'IconButton--danger': color === 'danger',
        'IconButton--success': color === 'success',
      })}
      {...props}
    >
      <span className="IconButton__icon">{icon}</span>
    </button>
  );
};
