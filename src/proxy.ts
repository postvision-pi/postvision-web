import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/Entrar';
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('token');
  return response;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return redirectToLogin(request);

  // Lido na execução do servidor, sem gravar o segredo na imagem Docker.
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET não definido nas variáveis do servidor web');
    return redirectToLogin(request);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
  } catch {
    return redirectToLogin(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/Status/:path*', '/Profile/:path*', '/Settings/:path*'],
};
