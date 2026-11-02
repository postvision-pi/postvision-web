import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LastTrainingChart from "@/app/components/LastTrainingChart/LastTrainingChart";
import { useSession } from "@/app/(dashboard)/SessionContext";
import { stats } from "./fixtures";

vi.mock("@/app/(dashboard)/SessionContext", () => ({ useSession: vi.fn() }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("recharts", () => {
  const Container = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Container, PieChart: Container,
    Pie: ({ data }: { data: unknown }) => <div data-testid="series">{JSON.stringify(data)}</div>,
    Cell: () => null, Tooltip: () => null, Legend: () => null,
  };
});

describe("último treino", () => {
  it("usa a sessão individual, preservando componentes novos do gráfico", () => {
    vi.mocked(useSession).mockReturnValue({ stats, loading: false, hasSessions: true, refresh: vi.fn() });
    render(<LastTrainingChart />);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(JSON.parse(screen.getByTestId("series").textContent!)).toEqual([
      { name: "Corretos", value: 8 }, { name: "Incorretos", value: 2 },
    ]);
  });

  it("mantém o estado de carregamento", () => {
    vi.mocked(useSession).mockReturnValue({ stats: null, loading: true, hasSessions: false, refresh: vi.fn() });
    render(<LastTrainingChart />);
    expect(screen.getByText("Carregando estatísticas...")).toBeInTheDocument();
    expect(screen.queryByTestId("series")).not.toBeInTheDocument();
  });

  it.each([null, { ...stats, lastSession: null }, {
    ...stats, lastSession: { date: "2026-10-28", corretos: 0, incorretos: 0, total: 0, accuracy: 0 },
  }])("mantém o estado vazio sem gerar NaN", value => {
    vi.mocked(useSession).mockReturnValue({ stats: value, loading: false, hasSessions: value !== null, refresh: vi.fn() });
    render(<LastTrainingChart />);
    expect(screen.queryByTestId("series")).not.toBeInTheDocument();
    expect(screen.getByText(/Ainda não há treinos|Nenhum treino com repetições/)).toBeInTheDocument();
  });
});
