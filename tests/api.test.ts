import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "@/lib/api";

describe("token e cabeçalhos", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "token=; path=/; max-age=0";
  });

  it("salva e remove o token e os dados da sessão", () => {
    api.saveToken("token-exemplo");
    localStorage.setItem("usuario", '{"id_usuario":"123"}');
    expect(api.getToken()).toBe("token-exemplo");
    expect(document.cookie).toContain("token=token-exemplo");
    expect(api.authHeaders()).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token-exemplo",
    });

    api.clearToken();
    expect(api.getToken()).toBeNull();
    expect(localStorage.getItem("usuario")).toBeNull();
    expect(document.cookie).not.toContain("token=");
    expect(api.authHeaders()).not.toHaveProperty("Authorization");
  });

  it("decodifica nomes com acentos em um payload UTF-8/base64url", () => {
    const payload = { nome_usuario: "João", sobrenome_usuario: "Conceição" };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    expect(api.decodeTokenPayload(`header.${encoded}.signature`)).toEqual(payload);
  });

  it.each(["", "sem-payload", "a.%%.c", "a.bmFvLWpzb24.c"])(
    "retorna null para token malformado: %s",
    (token) => expect(api.decodeTokenPayload(token)).toBeNull(),
  );
});

describe("requisições à API", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "jwt-teste");
    vi.stubGlobal("fetch", fetchMock);
  });

  it("envia login sem Authorization e preserva erros HTTP para o formulário", async () => {
    const response = new Response('{"error":"Senha inválida"}', { status: 400 });
    fetchMock.mockResolvedValueOnce(response);
    const result = await api.apiLogin("ana@exemplo.local", "incorreta");
    expect(result).toBe(response);
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "ana@exemplo.local", password: "incorreta" }),
    });
  });

  it("envia o cadastro como JSON sem token", async () => {
    const data = { firstName: "Ana", gender: "Outro" };
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 201 }));
    await api.apiRegister(data);
    expect(fetchMock).toHaveBeenCalledWith("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });

  it.each([
    ["PUT", "/user/u1", () => api.apiUpdateUser("u1", { firstName: "Ana" })],
    ["GET", "/session/stats/u1", () => api.apiGetSessionStatsByUserId("u1")],
    ["GET", "/session/u1", () => api.apiGetSessionsByUserId("u1")],
    ["POST", "/notifications/", () => api.apiCreateNotification({ title: "Treino" })],
    ["GET", "/notifications/u1", () => api.apiGetAllNotifications("u1")],
    ["PUT", "/notifications/n1/read", () => api.apiMarkNotificationAsRead("n1")],
    ["DELETE", "/notifications/n1", () => api.apiDeleteNotification("n1")],
  ] as const)("%s %s inclui o Bearer JWT", async (method, path, call) => {
    const response = new Response("{}");
    fetchMock.mockResolvedValueOnce(response);
    expect(await call()).toBe(response);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(path), expect.objectContaining({
      method,
      headers: expect.objectContaining({ Authorization: "Bearer jwt-teste" }),
    }));
  });

  it("propaga falha de rede para quem chamou", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(api.apiGetSessionStatsByUserId("u1")).rejects.toThrow("Failed to fetch");
  });
});
