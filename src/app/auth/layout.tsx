import './layout.scss';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return <div className="AuthLayout">{props.children}</div>;
}
