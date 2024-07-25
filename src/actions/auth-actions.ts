'use server';

import crypto from 'crypto';
import { PrismaClient, User } from '@prisma/client';
import { ActionResponse } from './class';
import { sendVerificationEmail } from './email-actions';
import { omissions } from './omissions';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient(omissions);

const createToken = () => {
  return new Promise<string>((resolve, reject) =>
    crypto.randomBytes(20, (err, buf) => (err ? reject(null) : resolve(buf.toString('hex'))))
  );
};

const getFutureDate = (minutes = 30) => {
  return new Date(Date.now() + 1000 * 60 * minutes);
};

export async function createUser(email: string, password1: string, password2: string) {
  // TODO: Add email string and password strength validation
  if (password1 !== password2) return ActionResponse.error('Passwords do not match').toJSON();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return ActionResponse.error('User already exists').toJSON();

  const token = await createToken().catch(() => null);
  if (!token) return ActionResponse.error('Token generation failed').toJSON();

  const hashedPassword = await new Promise<string>((resolve, reject) => {
    bcrypt.hash(password1, 10, (err, hash) => (err ? reject(err) : resolve(hash)));
  });

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      validationToken: token,
      validationTokenExpiration: getFutureDate(),
    },
  });
  // TODO: Uncomment
  // sendVerificationEmail(email, token);
  return ActionResponse.success<User>('User created', { user }).toJSON();
}

export async function requestNewToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return ActionResponse.error('User not found').toJSON();

  const token = await createToken().catch(() => null);
  if (!token) return ActionResponse.error('Token generation failed').toJSON();

  await prisma.user
    .update({
      where: { email },
      data: {
        validationToken: token,
        validationTokenExpiration: getFutureDate(),
      },
    })
    .catch(() => {
      return ActionResponse.error('Token update failed').toJSON();
    });

  // TODO: Uncomment
  // sendVerificationEmail(email, token);
  return ActionResponse.success<User>('Token updated', { user }).toJSON();
}
