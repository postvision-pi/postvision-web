// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { proxy, config } from "@/proxy";
import { getToken } from "@/lib/api";

const secret = "segredo-exclusivo-dos-testes-postvision";
const request = (path: string, token?: string) => new NextRequest(`http://localhost:3000${path}`, {
  headers: token ? { cookie: `token=${token}` } : {},
});
const sign = (key = secret, expires = "2h") => new SignJWT({ id_usuario: "u1" })
  .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expires)
  .sign(new TextEncoder().encode(key));

describe("proxy de autenticação", () => {
  beforeEach(() => { vi.stubEnv("JWT_SECRET", secret); });

  it.each(["/Status", "/Profile", "/Settings"])("redireciona %s sem token", async path => {
    expect(config.matcher).toContain(`${path}/:path*`);
    const res = await proxy(request(path));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/Entrar");
  });

  it("aceita token assinado pelo mesmo segredo da API", async () => {
    const res = await proxy(request("/Status", await sign()));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("rejeita token com outra assinatura e expira o cookie", async () => {
    const res = await proxy(request("/Status", await sign("segredo-incorreto")));
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie")).toContain("token=;");
  });

  it("rejeita token expirado", async () => {
    expect((await proxy(request("/Status", await sign(secret, "-1h")))).status).toBe(307);
  });

  it("rejeita token malformado", async () => {
    expect((await proxy(request("/Status", "malformado"))).status).toBe(307);
  });

  it("não libera a rota se o servidor estiver sem segredo", async () => {
    vi.stubEnv("JWT_SECRET", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await proxy(request("/Status", await sign()))).status).toBe(307);
  });

  it("o helper getToken é seguro no servidor sem window", () => {
    expect(getToken()).toBeNull();
  });
});
