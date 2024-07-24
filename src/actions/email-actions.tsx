'use server';

import { Resend } from 'resend';
import { Verification } from '~/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string | null) {
  if (!token) return;
  return resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Verify your email',
    react: <Verification token={token} />,
  });
}
