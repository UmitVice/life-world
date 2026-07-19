import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return withAuth(request as NextRequestWithAuth, event);
}

export const config = {
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages', '/admin'],
};
