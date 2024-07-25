import { Home } from '~/features/home';
import { LoginButton, LogoutButton, User } from './components';
import { authOptions } from '~/app/api/auth/[...nextauth]/route';
import NextAuth from 'next-auth';

export default async function Page() {
  // return <Home />;
  const session = NextAuth()

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
