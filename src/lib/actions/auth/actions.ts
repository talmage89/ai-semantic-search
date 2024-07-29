'use server';

import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';

import { signIn, signOut } from '~/auth';
import { ActionResponse } from '~/lib/classes';
import { loginSchema, defaultOmission } from '~/lib/types';
import { sendVerificationEmail } from '../email/actions';

const prisma = new PrismaClient(defaultOmission);

const createToken = () => {
  return new Promise<string>((resolve, reject) =>
    crypto.randomBytes(20, (err, buf) => (err ? reject(null) : resolve(buf.toString('hex'))))
  );
};

const getFutureDate = (minutes = 60) => {
  return new Date(Date.now() + 1000 * 60 * minutes);
};

export async function createUser(email: string, password1: string, password2: string) {
  // // TODO: Add email string and password strength validation
  if (password1 !== password2) {
    return ActionResponse.error('Passwords do not match').toJSON();
  }
  const validatedFields = loginSchema.safeParse({ email, password: password1 });
  if (!validatedFields.success) {
    const errorMessages = validatedFields.error?.errors.map((e) => e.message).join('\n') || 'Input error';
    return ActionResponse.error(errorMessages).toJSON();
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return ActionResponse.error('User already exists').toJSON();
  }
  const token = await createToken().catch(() => null);
  if (!token) {
    return ActionResponse.error('Token generation failed').toJSON();
  }
  const bcrypt = require('bcrypt');
  const hashedPassword = await new Promise<string>((resolve, reject) => {
    bcrypt.hash(password1, 10, (err: any, hash: any) => (err ? reject(err) : resolve(hash)));
  });
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      validationToken: token,
      validationTokenExpiration: getFutureDate(),
    },
  });
  // TODO: uncomment
  // sendVerificationEmail(email, token);
  console.log(`${process.env.URL}/verify?token=${token}`);
  return ActionResponse.success<User>('User created', { user }).toJSON();
}

export async function requestNewToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return ActionResponse.error('User not found').toJSON();
  }
  const token = await createToken().catch(() => null);
  if (!token) {
    return ActionResponse.error('Token generation failed').toJSON();
  }
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
  // TODO: uncomment
  // sendVerificationEmail(email, token);
  console.log(`${process.env.URL}/verify?token=${token}`);
  return ActionResponse.success<User>('Token updated', { user }).toJSON();
}

export async function verifyToken(email: string, token: string) {
  const userFound = await prisma.user.findFirst({
    where: { email },
    select: { email: true, validationToken: true, validationTokenExpiration: true },
  });
  if (!userFound) {
    return ActionResponse.error('User not found').toJSON();
  }
  if (userFound.validationToken !== token) {
    return ActionResponse.error('Invalid token').toJSON();
  }
  if (!userFound.validationTokenExpiration || userFound.validationTokenExpiration < new Date()) {
    return ActionResponse.error('Token expired').toJSON();
  }

  const updatedUser = await prisma.user
    .update({
      select: { email: true, verified: true },
      where: { email: userFound.email },
      data: {
        verified: true,
        validationToken: null,
        validationTokenExpiration: null,
      },
    })
    .catch(() => null);

  if (!updatedUser) {
    return ActionResponse.error('Verification failed').toJSON();
  } else {
    return ActionResponse.success<User>('Token verified', { user: updatedUser }).toJSON();
  }
}

export async function login(email: string, password: string) {
  try {
    const validatedFields = loginSchema.safeParse({ email, password });
    if (!validatedFields.success) {
      return ActionResponse.error('Validation error').toJSON();
    }
    const user = await signIn('credentials', { redirect: false, email, password });
    return ActionResponse.success<User>('Logged in', { user }).toJSON();
  } catch (error: any) {
    const message = error.cause?.err?.message || 'Login failed';
    return ActionResponse.error(message).toJSON();
  }
}

export async function logout() {
  await signOut();
}
