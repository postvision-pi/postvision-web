"use client";
import styles from "./LastTrainingChart.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";
import ChartTooltip from "@/app/components/ChartTooltip/ChartTooltip";
import ChartEmptyState from "@/app/components/ChartEmptyState/ChartEmptyState";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#1B0066", "#E3D93F"];

export default function LastTrainingCharts() {
  const { stats, loading, hasSessions } = useSession();

  // Usa o último treino da semana (entrada mais recente)
  const lastSession = stats?.weekly[stats.weekly.length - 1];

  const corretos = lastSession?.corretos ?? 0;
  const total = lastSession?.total ?? 0;
  const incorretos = total - corretos;
  const percentual = total > 0 ? (corretos / total) * 100 : 0;

  const chartData = [
    { name: "Corretos", value: corretos },
    { name: "Incorretos", value: incorretos },
  ];

  // pode ter sessões antigas mas nenhuma nos últimos 7 dias (janela do "weekly")
  const hasRecentSession = hasSessions && !!lastSession && total > 0;

  return (
    <div className={styles.graphContainer}>
      <div className={styles.title}>Ultimo Treino</div>
      <div className={styles.subtitle}>Agachamento</div>
      {loading || !hasRecentSession ? (
        <ChartEmptyState
          loading={loading}
          message={
            hasSessions
              ? "Nenhum treino nos últimos dias. Realize uma nova análise para atualizar essa estatística."
              : undefined
          }
        />
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer className={styles.chartSize}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "var(--highlight-black-500)", fontSize: 14 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.centerText}>
            <span>{percentual.toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
