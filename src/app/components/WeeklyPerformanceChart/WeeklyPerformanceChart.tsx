"use client";
import styles from "./WeeklyPerformanceChart.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";

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

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function WeeklyPerformanceChart() {
    const { stats } = useSession();

    const todayWeek = new Date().getDay();
    const lastDayWeek = (todayWeek - 1 + 7) % 7;

    // monta a ordem dinâmica (últimos 7 dias terminando em ontem)
    const orderedDays = Array.from({ length: 7 }, (_, i) => {
        return (lastDayWeek - 6 + i + 7) % 7;
    });

    const chartData = orderedDays.map((dayIndex) => {
        const found = stats?.weekly.find(
            (item) => new Date(item.date).getDay() === dayIndex
        );

        return {
            name: DAYS[dayIndex],
            corretos: found ? found.corretos : 0,
            total: found ? found.total : 0,
        };
    });

    return (
        <div className={styles.graphContainer}>
            <div className={styles.title}>Desempenho Semanal</div>
            <div className={styles.subtitle}>Agachamento</div>
            <div className={styles.chart}>
                <ResponsiveContainer className={styles.chartSize}>
                    <BarChart data={chartData} barCategoryGap="20%">
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
                        <Bar dataKey="corretos" name="Corretos" fill="#1B0066" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="total" name="Total" fill="#E3D93F" radius={[0, 0, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
