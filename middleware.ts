import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // 1. Proteksi Halaman Admin
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log("Akses Ditolak: Tidak ada sesi");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Mencegah user yang sudah login untuk buka halaman login kembali
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};