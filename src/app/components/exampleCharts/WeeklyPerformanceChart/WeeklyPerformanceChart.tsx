"use client";
import styles from "./WeeklyPerformanceChart.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const data = [
  { name: 'Dom', corretos: 10, total: 20 },
  { name: 'Seg', corretos: 40, total: 50 },
  { name: 'Ter', corretos: 45, total: 60 },
  { name: 'Qua', corretos: 5, total: 10 },
  { name: 'Qui', corretos: 35, total: 50 },
  { name: 'Sex', corretos: 55, total: 60 },
  { name: 'Sab', corretos: 20, total: 25 },
];



export default function WeeklyPerformanceChart() {
  return(
        <div className={styles.graphContainer}>
            <div className={styles.title}>Desempenho Semanal</div>
            <div className={styles.subtitle}>Agachamento</div>
            <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                        <span style={{ color: '#1c1c1c', fontSize: 16 }}>{value}</span>
                        )}
                    />
                    <Bar
                        dataKey="corretos"
                        name="Corretos"
                        fill="#1B0066"
                        radius={[0, 0, 0, 0]}
                    />
                    <Bar
                        dataKey="total"
                        name="Total"
                        fill="#E3D93F"
                        radius={[0, 0, 0, 0]}
                    />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
  )
}