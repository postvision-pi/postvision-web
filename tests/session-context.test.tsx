import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SessionProvider, useSession } from "@/app/(dashboard)/SessionContext";
import { useUser } from "@/app/(dashboard)/UserContext";
import { apiGetSessionStatsByUserId } from "@/lib/api";
import { stats } from "./fixtures";

vi.mock("@/app/(dashboard)/UserContext", () => ({ useUser: vi.fn() }));
vi.mock("@/lib/api", () => ({ apiGetSessionStatsByUserId: vi.fn() }));
const user = { id_usuario: "u1" } as NonNullable<ReturnType<typeof useUser>>;
const wrapper = ({ children }: { children: ReactNode }) => <SessionProvider>{children}</SessionProvider>;

describe("estatísticas de sessão", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useUser).mockReturnValue(user);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("carrega os dados e permite atualizar", async () => {
    vi.mocked(apiGetSessionStatsByUserId).mockImplementation(async () => Response.json(stats));
    const { result } = renderHook(useSession, { wrapper });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.stats).toEqual(stats));
    expect(result.current.loading).toBe(false);
    expect(result.current.hasSessions).toBe(true);
    await act(async () => result.current.refresh());
    expect(apiGetSessionStatsByUserId).toHaveBeenCalledTimes(2);
  });

  it("encerra o carregamento sem buscar quando não há usuário", async () => {
    vi.mocked(useUser).mockReturnValue(null);
    const { result } = renderHook(useSession, { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats).toBeNull();
    expect(result.current.hasSessions).toBe(false);
    expect(apiGetSessionStatsByUserId).not.toHaveBeenCalled();
  });

  it.each([401, 403, 500])("não armazena um erro HTTP %s como estatísticas", async status => {
    vi.mocked(apiGetSessionStatsByUserId).mockResolvedValue(Response.json({ error: "Falha" }, { status }));
    const { result } = renderHook(useSession, { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats).toBeNull();
    expect(result.current.hasSessions).toBe(false);
  });

  it("encerra o carregamento após falha de rede", async () => {
    vi.mocked(apiGetSessionStatsByUserId).mockRejectedValue(new TypeError("Sem rede"));
    const { result } = renderHook(useSession, { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats).toBeNull();
    expect(result.current.hasSessions).toBe(false);
  });

  it("ignora resposta pendente depois de sair da conta", async () => {
    let resolve!: (response: Response) => void;
    vi.mocked(apiGetSessionStatsByUserId).mockReturnValue(new Promise(r => { resolve = r; }));
    const { result, rerender } = renderHook(useSession, { wrapper });
    vi.mocked(useUser).mockReturnValue(null);
    rerender();
    await act(async () => resolve(Response.json(stats)));
    expect(result.current.stats).toBeNull();
    expect(result.current.hasSessions).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
