import { PrismaClient, User } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';
import { omissions } from '~/lib/omissions';

const prisma = new PrismaClient(omissions);

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, id: token.id as string, verified: token.verified as boolean },
      };
    },
    jwt: ({ token, user }) => {
      return !user ? token : { ...token, id: user.id, verified: (user as User).verified };
    },
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
