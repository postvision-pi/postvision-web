"use client";
import styles from "./LastTrainingChart.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";

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
  const { stats } = useSession();

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

  return (
    <div className={styles.graphContainer}>
      <div className={styles.title}>Ultimo Treino</div>
      <div className={styles.subtitle}>Agachamento</div>
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
            <Tooltip />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#1c1c1c", fontSize: 14 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centerText}>
          <span>{percentual.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
