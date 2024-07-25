import NextAuth from 'next-auth';
import { PrismaClient, User } from '@prisma/client';

import CredentialsProvider from 'next-auth/providers/credentials';
import { omissions } from '~/actions/omissions';
import { compare } from 'bcrypt';


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
