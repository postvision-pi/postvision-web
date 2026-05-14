"use client";
import styles from "./MonthlyComparisionChart.module.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { dia: 1, agachamentos: 30 },
  { dia: 5, agachamentos: 45 },
  { dia: 10, agachamentos: 60 },
  { dia: 15, agachamentos: 68 },
  { dia: 20, agachamentos: 75 },
  { dia: 25, agachamentos: 80 },
  { dia: 30, agachamentos: 92 },
];

export default function MonthlyComparisionChart() {
  return (
    <div className={styles.graphContainer}>
      <div className={styles.title}>Comparativo Mensal</div>
      <div className={styles.subtitle}>Agachamento</div>
      <div className={styles.chart}>
        <ResponsiveContainer className={styles.lineChart} width="100%" height={220}>
          <LineChart data={data}>
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
