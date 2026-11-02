import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HistoryModal from "@/app/components/HistoryModal/HistoryModal";
import { apiGetSessionsByUserId } from "@/lib/api";

vi.mock("@/lib/api", () => ({ apiGetSessionsByUserId: vi.fn() }));
vi.mock("@/app/(dashboard)/UserContext", () => ({ useUser: () => ({ id_usuario: "u1" }) }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/app/context/AppSettingsContext", () => ({
  useAppSettings: () => ({ language: "pt", t: (key: string) => key }),
}));

describe("histórico preservado", () => {
  beforeEach(() => { vi.resetAllMocks(); });

  it("apresenta carregamento enquanto a consulta está pendente", () => {
    vi.mocked(apiGetSessionsByUserId).mockReturnValue(new Promise(() => {}));
    render(<HistoryModal onClose={vi.fn()} />);
    expect(screen.getByText("history.loading")).toBeInTheDocument();
    expect(apiGetSessionsByUserId).toHaveBeenCalledWith("u1");
  });

  it("apresenta a lista vazia", async () => {
    vi.mocked(apiGetSessionsByUserId).mockResolvedValue(Response.json([]));
    render(<HistoryModal onClose={vi.fn()} />);
    expect(await screen.findByText("history.empty")).toBeInTheDocument();
  });

  it("mostra erro em vez de tentar renderizar resposta HTTP inválida", async () => {
    vi.mocked(apiGetSessionsByUserId).mockResolvedValue(Response.json({ error: "Falha" }, { status: 500 }));
    render(<HistoryModal onClose={vi.fn()} />);
    expect(await screen.findByText("history.error")).toBeInTheDocument();
  });

  it("lista os treinos mais recentes primeiro com dados da API", async () => {
    vi.mocked(apiGetSessionsByUserId).mockResolvedValue(Response.json([
      { _id: "s1", date: "2026-10-01T12:00:00Z", durationInSeconds: 100, exerciseId: { name: "Treino antigo" } },
      { _id: "s2", date: "2026-10-02T12:00:00Z", durationInSeconds: 90, exerciseId: { name: "Treino recente" }, report: { correctReps: 8, incorrectReps: 2, averageAccuracy: 80 } },
    ]));
    const { container } = render(<HistoryModal onClose={vi.fn()} />);
    await screen.findByText("Treino recente");
    const text = container.textContent!;
    expect(text.indexOf("Treino recente")).toBeLessThan(text.indexOf("Treino antigo"));
    expect(screen.getByText("history.duration: 1min 30s")).toBeInTheDocument();
    expect(screen.getByText("history.accuracy: 80%")).toBeInTheDocument();
  });

  it("fecha pelo botão sem propagar o clique no conteúdo", () => {
    vi.mocked(apiGetSessionsByUserId).mockReturnValue(new Promise(() => {}));
    const close = vi.fn();
    render(<HistoryModal onClose={close} />);
    fireEvent.click(screen.getByText("history.title"));
    expect(close).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "history.close" }));
    expect(close).toHaveBeenCalledOnce();
  });
});
