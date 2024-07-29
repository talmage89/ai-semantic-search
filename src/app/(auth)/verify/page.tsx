'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import { logout, requestNewToken, verifyToken } from '~/lib/actions';
import { ActionResponse } from '~/lib/classes';
import { Container } from '~/ui';
import './page.scss';

export default function Page() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const params = useSearchParams();

  React.useEffect(() => {
    const token = params.get('token');
    const email = session?.user?.email;
    token && email && handleVerifyToken(email, token);
  }, [params, session]);

  const handleVerifyToken = async (email: string, token: string) => {
    try {
      const str = await verifyToken(email, token);
      const res = await ActionResponse.fromJSON<User>(str);
      await update({ verified: res.data.user.verified });
      router.push('/');
    } catch (e: any) {
      // console.log(e.message);
    }
  };

  const handleRequestNewLink = async () => {
    const email = session?.user?.email;
    email && (await requestNewToken(email));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <Container className="AuthVerify">
      <h2 className="mb-8">Verify your email</h2>
      <p className="mb-4">We have sent you an email with a link to verify your account.</p>
      <p className="mb-4">
        If you did not receive the email, please check your spam folder. You can request a new link by clicking below,
        but note that doing so will invalidate all previous links.
      </p>
      <p>
        Your verification link will expire after one hour. Request a new link if you think your current link has
        expired.
      </p>
      <div className="flex align-center gap-8 mt-12">
        <button onClick={handleRequestNewLink} className="AuthVerify__button">
          Get a new validation link
        </button>
        <button onClick={handleLogout} className="AuthVerify__button">
          Log out
        </button>
      </div>
    </Container>
  );
}
