'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export const LoginButton = () => {
  return <button onClick={() => signIn()}>Log in</button>;
};

export const LogoutButton = () => {
  return <button onClick={() => signOut()}>Log out</button>;
};

export const User = () => {
  const { data: session } = useSession();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};
