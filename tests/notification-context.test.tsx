import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationProvider, useNotifications } from "@/app/(dashboard)/NotificationContext";
import { useUser } from "@/app/(dashboard)/UserContext";
import { apiGetAllNotifications, apiDeleteNotification, apiMarkNotificationAsRead } from "@/lib/api";
import { notification } from "./fixtures";

vi.mock("@/app/(dashboard)/UserContext", () => ({ useUser: vi.fn() }));
vi.mock("@/lib/api", () => ({
  apiGetAllNotifications: vi.fn(), apiDeleteNotification: vi.fn(), apiMarkNotificationAsRead: vi.fn(),
}));
const user = { id_usuario: "u1" } as NonNullable<ReturnType<typeof useUser>>;
const wrapper = ({ children }: { children: ReactNode }) => <NotificationProvider>{children}</NotificationProvider>;

describe("notificações", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useUser).mockReturnValue(user);
    vi.mocked(apiGetAllNotifications).mockImplementation(async () => Response.json([notification]));
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("carrega a lista e encerra o carregamento", async () => {
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toEqual([notification]));
    expect(result.current.loading).toBe(false);
  });

  it("limpa a lista ao sair e não busca sem usuário", async () => {
    const { result, rerender } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    vi.mocked(useUser).mockReturnValue(null);
    rerender();
    await waitFor(() => expect(result.current.notifications).toEqual([]));
    expect(result.current.loading).toBe(false);
    expect(apiGetAllNotifications).toHaveBeenCalledTimes(1);
  });

  it("mantém a lista vazia quando o carregamento recebe HTTP 401", async () => {
    vi.mocked(apiGetAllNotifications).mockResolvedValue(Response.json({ error: "Token inválido" }, { status: 401 }));
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toEqual([]);
  });

  it("marca como lida antes da resposta e mantém após sucesso", async () => {
    let resolve!: (response: Response) => void;
    vi.mocked(apiMarkNotificationAsRead).mockReturnValue(new Promise(r => { resolve = r; }));
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    let action!: Promise<void>;
    act(() => { action = result.current.markAsRead("n1"); });
    expect(result.current.notifications[0].read).toBe(true);
    await act(async () => { resolve(Response.json({ ...notification, read: true })); await action; });
    expect(result.current.notifications[0].read).toBe(true);
  });

  it("remove uma notificação após sucesso", async () => {
    vi.mocked(apiDeleteNotification).mockResolvedValue(Response.json({ message: "Deletada" }));
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    await act(async () => result.current.deleteNotification("n1"));
    expect(result.current.notifications).toEqual([]);
  });

  it.each(["markAsRead", "deleteNotification"] as const)("reverte %s após erro HTTP", async action => {
    vi.mocked(apiMarkNotificationAsRead).mockResolvedValue(new Response(null, { status: 403 }));
    vi.mocked(apiDeleteNotification).mockResolvedValue(new Response(null, { status: 500 }));
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    await act(async () => result.current[action]("n1"));
    expect(result.current.notifications).toEqual([notification]);
    expect(apiGetAllNotifications).toHaveBeenCalledTimes(2);
  });

  it.each(["markAsRead", "deleteNotification"] as const)("reverte %s mesmo se ação e nova consulta falharem", async action => {
    const { result } = renderHook(useNotifications, { wrapper });
    await waitFor(() => expect(result.current.notifications).toHaveLength(1));
    vi.mocked(apiGetAllNotifications).mockRejectedValue(new TypeError("Sem rede"));
    vi.mocked(apiMarkNotificationAsRead).mockRejectedValue(new TypeError("Sem rede"));
    vi.mocked(apiDeleteNotification).mockRejectedValue(new TypeError("Sem rede"));
    await act(async () => result.current[action]("n1"));
    expect(result.current.notifications).toEqual([notification]);
  });
});
