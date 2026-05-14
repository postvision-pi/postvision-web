import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Garante que a SECRET existe
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
}

const SECRET = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  // Se não houver token, redireciona para /Entrar
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/Entrar';
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verifica se o token é válido
    await jwtVerify(token, SECRET);
  } catch (err) {
    console.log('Token inválido:', err);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/Entrar';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Status/:path*', '/Profile/:path*', '/Settings/:path*'],
};