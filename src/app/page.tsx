import { Home } from '~/features/home';
import { LoginButton, LogoutButton, User } from './components';
import { auth } from '~/auth';

export default async function Page() {
  // return <Home />;

  const  session = auth();

  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <h2>Client call</h2>
      <User />
    </div>
  );
}
