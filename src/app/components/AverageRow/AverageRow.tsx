"use client";
import styles from "./AverageRow.module.css";
import { useSession } from "@/app/(dashboard)/SessionContext";

export default function AverageRow() {
  const { stats, loading, hasSessions } = useSession();

  // avgDuration vem em segundos e é a duração média por sessão — não
  // existe um campo "média diária" separado na API, então uso esse
  const avgDurationMin =
    typeof stats?.avgDuration === "number" ? Math.round(stats.avgDuration / 60) : null;

  const avgAccuracy =
    typeof stats?.avgAccuracy === "number" ? Math.round(stats.avgAccuracy) : null;

  const showEmpty = !loading && !hasSessions;

  return (
    <div className={styles.averageRow}>
        <div className={styles.dailyAverage}>
            <div className={styles.title}>Média Diária:</div>
            {loading ? (
              <div className={styles.counter}>...</div>
            ) : showEmpty || avgDurationMin === null ? (
              <>
                <div className={styles.counter}>—</div>
                <div className={styles.emptyHint}>Sem treinos ainda</div>
              </>
            ) : (
              <div className={styles.counter}>{avgDurationMin}min</div>
            )}
        </div>
        <div className={styles.sessionAverage}>
            <div className={styles.sessionAverageContainer}>
            <div className={styles.title}>Média por sessão:</div>
            {loading ? (
              <>
                <div className={styles.counter}>...</div>
                <div className={styles.counterText}>Execuções corretas</div>
              </>
            ) : showEmpty || avgAccuracy === null ? (
              <>
                <div className={styles.counter}>—</div>
                <div className={styles.counterText}>Sem treinos ainda</div>
              </>
            ) : (
              <>
                <div className={styles.counter}>{avgAccuracy}%</div>
                <div className={styles.counterText}>Execuções corretas</div>
              </>
            )}
            </div>
        </div>
    </div>
  );
}
