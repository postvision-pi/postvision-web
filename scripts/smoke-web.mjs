import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

// Permite usar o .env.local em uma conferência manual; variáveis já exportadas prevalecem.
try { process.loadEnvFile(".env.local"); } catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const base = (process.env.SMOKE_WEB_URL || "http://localhost:3000").replace(/\/+$/, "");
const secret = process.env.JWT_SECRET;
assert.ok(secret, "Defina JWT_SECRET igual ao do servidor web para conferir o proxy");

function token(key) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    id_usuario: "usuario-sintetico-do-smoke", exp: Math.floor(Date.now() / 1000) + 300,
  })).toString("base64url");
  const input = `${header}.${payload}`;
  return `${input}.${createHmac("sha256", key).update(input).digest("base64url")}`;
}

const get = (path, init = {}) => fetch(`${base}${path}`, {
  ...init, signal: AbortSignal.timeout(5000),
});

let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try {
    if ((await get("/health")).ok) { ready = true; break; }
  } catch {}
  await new Promise(resolve => setTimeout(resolve, 500));
}
assert.ok(ready, "Servidor web não ficou saudável dentro do prazo");
assert.deepEqual(await (await get("/health")).json(), { status: "ok", service: "postvision-web" });

for (const path of ["/", "/Entrar", "/Cadastro", "/images/logo-purple.svg"]) {
  assert.equal((await get(path)).status, 200, `GET ${path}`);
}
for (const path of ["/Status", "/Profile", "/Settings"]) {
  const response = await get(path, { redirect: "manual" });
  assert.equal(response.status, 307, `Proteção de ${path}`);
  assert.equal(new URL(response.headers.get("location"), base).pathname, "/Entrar");
}
for (const [key, expected] of [[secret, 200], [`${secret}-invalido`, 307]]) {
  const response = await get("/Status", {
    redirect: "manual", headers: { cookie: `token=${token(key)}` },
  });
  assert.equal(response.status, expected, "Assinatura JWT no proxy");
}

if (process.env.SMOKE_CHECK_API === "true") {
  const response = await get("/api/health");
  assert.equal(response.status, 200, "Encaminhamento /api/health para o backend");
  assert.equal((await response.json()).status, "ok", "Saúde do backend");
  console.log("Encaminhamento /api/health conferido.");
}

// Confere que o runtime standalone recebeu também o CSS/JS e as fontes geradas.
const html = await (await get("/Entrar")).text();
const assets = [...new Set([...html.matchAll(/(?:src|href)="([^"<>]*\/_next\/static\/[^"<>]+)"/g)]
  .map(match => match[1]))];
assert.ok(assets.length > 0, "Página sem referências aos assets do Next.js");
for (const path of assets) assert.equal((await get(path)).status, 200, `Asset ${path}`);
console.log(`Web saudável: páginas, autenticação, imagem e ${assets.length} assets conferidos.`);
console.log("Essa checagem HTTP não faz login de usuário nem grava no banco.");
