"use client";
import styles from "./AverageRow.module.css";

export default function AverageRow() {
  return (
    <div className={styles.averageRow}>
        <div className={styles.dailyAverage}>
            <div className={styles.title}>Média Diária:</div>
            <div className={styles.counter}>10min</div>
        </div>
        <div className={styles.sessionAverage}>
            <div className={styles.sessionAverageContainer}>
            <div className={styles.title}>Média por sessão:</div>
            <div className={styles.counter}>68%</div>
            <div className={styles.counterText}>Execuções corretas</div>
            </div>
        </div>
    </div>
  );
}
