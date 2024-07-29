import { User } from '@prisma/client';
import NextAuth from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';
import { PROTECTED_ROUTES, PUBLIC_ROUTES, UNVERIFIED_ROUTES } from './routes';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const userAuthenticated = !!req.auth;
  const userVerified = (req.auth?.user as User)?.verified;

  return userAuthenticated
    ? userVerified
      ? authenticatedMiddleware(nextUrl)
      : unverifiedMiddleware(nextUrl)
    : unauthenticatedMiddleware(nextUrl);
});

function authenticatedMiddleware(url: NextURL) {
  const isProtectedRoute = PROTECTED_ROUTES.includes(url.pathname);

  if (!isProtectedRoute) {
    return Response.redirect(new URL(PROTECTED_ROUTES[0], url));
  }
}

function unverifiedMiddleware(url: NextURL) {
  const isUnverifiedRoute = UNVERIFIED_ROUTES.includes(url.pathname);

  if (!isUnverifiedRoute) {
    return Response.redirect(new URL(UNVERIFIED_ROUTES[0], url));
  }
}

function unauthenticatedMiddleware(url: NextURL) {
  const isPublicRoute = PUBLIC_ROUTES.includes(url.pathname);

  if (!isPublicRoute) {
    return Response.redirect(new URL(PUBLIC_ROUTES[0], url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
