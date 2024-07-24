'use server';

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export async function createUser(email: string, password1: string, password2: string) {
  const createToken = () =>
    new Promise<string>((resolve, reject) =>
      crypto.randomBytes(20, (err, buf) => (err ? reject(null) : resolve(buf.toString('hex'))))
    );

  const token = await createToken().catch(() => null);

  if (!token || password1 !== password2) {
    return null;
  }

  return await prisma.user.create({
    data: {
      email,
      password: password1,
      emailValidationToken: token,
    },
  });
}
