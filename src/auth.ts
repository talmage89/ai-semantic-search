import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { defaultOmission } from './lib/types';
import { authConfig } from './auth.config';

const prisma = new PrismaClient(defaultOmission);

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        const user = await prisma.user.findUnique({ omit: { password: false }, where: { email } });
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const bcrypt = require('bcrypt');
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
          throw new Error('Invalid credentials');
        }
        return user;
      },
    }),
  ],
});
