import { PrismaClient, User } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';
import { defaultOmission } from './lib/types';

const prisma = new PrismaClient(defaultOmission);

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/',
  },
  callbacks: {
    jwt: ({ token, user: uncastUser, trigger, session }) => {
      const user = uncastUser as User;
      if (trigger === 'update' && session) {
        return { ...token, verified: session.verified };
      }
      return !user ? token : { ...token, id: user.id, verified: user.verified };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, id: token.id as string, verified: token.verified as boolean },
      };
    },
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
