'use client';

import { Container } from '~/ui';
import './page.scss';

export default function Page() {
  const handleRequestNewLink = () => {};

  return (
    <Container className="AuthVerify">
      <h2 className="mb-8">Verify your email</h2>
      <p className="mb-4">We have sent you an email with a link to verify your account.</p>
      <p className="mb-4">
        If you did not receive the email, please check your spam folder. You can request a new link by clicking below,
        but note that requesting another link will invalidate all others.
      </p>
      <a onClick={handleRequestNewLink} href='/' className="mb-4">
        Get a new validation link
      </a>
    </Container>
  );
}
