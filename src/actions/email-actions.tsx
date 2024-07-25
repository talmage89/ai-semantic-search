'use server';

import { Resend } from 'resend';
import { Verification } from '~/emails';
import { ActionResponse } from './class';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string | null): Promise<ActionResponse> {
  if (!token) {
    return ActionResponse.error('Failed to create user');
  }

  await resend.emails.send({
    // TODO: Get domain email address
    from: 'Semantics <onboarding@resend.dev>',
    to: [email],
    subject: 'Verify your email',
    react: <Verification token={token} />,
  });

  return ActionResponse.success('Email sent', {});
}
