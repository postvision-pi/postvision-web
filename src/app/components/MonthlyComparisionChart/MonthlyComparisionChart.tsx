"use client";
import styles from "./MonthlyComparisionChart.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";
import ChartTooltip from "@/app/components/ChartTooltip/ChartTooltip";
import ChartEmptyState from "@/app/components/ChartEmptyState/ChartEmptyState";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MonthlyComparisionChart() {
  const { stats, loading, hasSessions } = useSession();

  const chartData = stats?.monthly.map((item) => ({
    dia: Number(item.date.split("-")[2]),
    agachamentos: item.totalReps,
  })) ?? [];

  return (
    <div className={styles.graphContainer}>
      <div className={styles.title}>Comparativo Mensal</div>
      <div className={styles.subtitle}>Agachamento</div>
      {loading || !hasSessions ? (
        <ChartEmptyState loading={loading} />
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer className={styles.lineChart}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,180,0.25)" />
              <XAxis dataKey="dia" tick={{ fill: 'var(--highlight-black-700)' }} />
              <YAxis tick={{ fill: 'var(--highlight-black-700)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="agachamentos"
                name="Agachamentos"
                stroke="#1B0066"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
