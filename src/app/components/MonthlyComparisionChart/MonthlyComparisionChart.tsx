"use client";
import styles from "./MonthlyComparisionChart.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";

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
  const { stats } = useSession();

  const chartData = stats?.monthly.map((item) => ({
    dia: Number(item.date.split("-")[2]),
    agachamentos: item.totalReps,
  })) ?? [];

  return (
    <div className={styles.graphContainer}>
      <div className={styles.title}>Comparativo Mensal</div>
      <div className={styles.subtitle}>Agachamento</div>
      <div className={styles.chart}>
        <ResponsiveContainer className={styles.lineChart}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="agachamentos"
              stroke="#1B0066"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
