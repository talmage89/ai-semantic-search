import type { NextAuthConfig } from 'next-auth';
import { PrismaClient, User } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { omissions } from '~/actions/omissions';
import { compare } from 'bcrypt';

const prisma = new PrismaClient(omissions);

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({ token, session }) => {
      // const { id, verified } = token;
      return { ...session, user: { ...session.user, id: token.id as string, verified: token.verified } };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const { id, email, verified } = user as User;
        return { ...token, id, email, verified };
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

// providers: [
//     CredentialsProvider({
//       name: 'Sign in',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       authorize: async (credentials, req) => {
//         if (!credentials?.email || !credentials?.password) return null;

//         const user = await prisma.user.findUnique({ omit: { password: false }, where: { email: credentials.email } });
//         if (!user) return null;

//         const passwordValid = await compare(credentials.password, user.password);
//         if (!passwordValid) return null;

//         return { ...user, password: undefined };
//       },
//     }),
//   ],
