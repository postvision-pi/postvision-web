
const API_URL = '/api';


export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}


export function saveToken(token: string) {
  localStorage.setItem('token', token);
  // Cookie lido pelo middleware Next.js para proteger rotas
  document.cookie = `token=${token}; path=/; SameSite=Strict; max-age=${60 * 60 * 24 * 2}`;
}


export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  document.cookie = 'token=; path=/; SameSite=Strict; max-age=0';
}

/**
 * Decodifica o payload do JWT sem verificar a assinatura.
 * Seguro no front-end: usamos só para exibir dados, não para autorização.
 */
export function decodeTokenPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

/** Headers padrão com Authorization Bearer */
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ──────────────────────────────────────────────
// Endpoints
// ──────────────────────────────────────────────

/** POST /auth — faz login e retorna { token, message } */
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log(res)
  return res;
}

/** POST /user — cria novo usuário */
export async function apiRegister(data: Record<string, string>) {
  const res = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res;
}

/** PUT /user/:id — atualiza dados do usuário */
export async function apiUpdateUser(id: string, data: Record<string, string>) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res;
}


/** GET /session/stats/:userId — estatísticas calculadas do usuário */
export async function apiGetSessionStatsByUserId(id: string) {
  const res = await fetch(`${API_URL}/session/stats/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return res;
}

/** GET /session/:userId — lista as sessões de treino do usuário */
export async function apiGetSessionsByUserId(id: string) {
  const res = await fetch(`${API_URL}/session/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return res;
}

// Endpoints de notificações

export async function apiCreateNotification(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/notifications/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res;
}

export async function apiGetAllNotifications(userId: string) {
  const res = await fetch(`${API_URL}/notifications/${userId}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return res;
}

export async function apiMarkNotificationAsRead(notificationId: string) {
  const res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  return res;
}

export async function apiDeleteNotification(notificationId: string) {
  const res = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res;
}

