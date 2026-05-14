"use client";
import styles from "./StreakCounter.module.css";
import { Icon } from "@iconify/react";
import { useSession } from "@/app/(dashboard)/SessionContext";

export default function StreakCounter() {
  const { stats } = useSession();
  return (
    <div className={styles.streakContainer}>
      <div className={styles.streakCounterContainer}>
        <Icon icon="bi:fire" className={styles.streakIcon}></Icon>
        <div className={styles.hole}></div>
        <div className={styles.streakCounter}>{stats?.streak || 0}</div>
      </div>
      <div className={styles.streakTexts}>
        <div className={styles.streakTitle}>Streak</div>
        <div className={styles.streakSubtitle}>
          Realize as análises para aumentar seu streak
        </div>
      </div>
    </div>
  );
}
