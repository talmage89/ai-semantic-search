import { User } from '@prisma/client';
import NextAuth from 'next-auth';
import { authConfig } from '~/auth.config';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT, UNVERIFIED_ROUTES } from '~/lib/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const userAuthenticated = !!req.auth;
  const userVerified = (req.auth?.user as User)?.verified;

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isUnverifiedRoute = UNVERIFIED_ROUTES.includes(nextUrl.pathname);

  if (userAuthenticated) {
    if (!userVerified) {
      if (!isUnverifiedRoute) return Response.redirect(new URL('/verify', nextUrl));
    }
    if (isPublicRoute) return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  } else {
    if (!isPublicRoute) return Response.redirect(new URL(ROOT, nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
