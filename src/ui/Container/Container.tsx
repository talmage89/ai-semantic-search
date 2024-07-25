import * as React from 'react';
import clsx from 'clsx';
import './Container.scss';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  withWrapper?: boolean;
};

export const Container = ({ className, children, withWrapper = true, ...rest }: ContainerProps) => {
  const container = () => (
    <div className={clsx('Container', className)} {...rest}>
      {children}
    </div>
  );
  return withWrapper ? <div className="Container__wrapper">{container()}</div> : container();
};
