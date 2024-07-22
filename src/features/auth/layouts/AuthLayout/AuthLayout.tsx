import './AuthLayout.scss';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = (props: AuthLayoutProps) => {
  <div className="AuthLayout">{props.children}</div>;
};
