import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // 🔒 Protected route: /translate → redirect if not logged in
  if (!session && request.nextUrl.pathname.startsWith('/translate')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Already logged in → skip login/signup pages
  if (session && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/translate', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/translate/:path*', '/login', '/signup'],
};