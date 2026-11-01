"use client";
import styles from "./RightBoard.module.css";
import StreakCalendar from "../StreakCalendar/SteakCalendar";
import AverageRow from "../AverageRow/AverageRow";
import StreakCounter from "../StreakCounter/StreakCounter";
import AppStatusRow from "../AppStatusRow/AppStatusRow";

export default function RightBoard({ hideStatsOnMobile = false }: { hideStatsOnMobile?: boolean }) {
  return (
    <div className={styles.rightBoard}>
      <div className={styles.headerFixed}>
        <AppStatusRow/>
      </div>
      <div className={hideStatsOnMobile ? styles.statsGroupHiddenMobile : styles.statsGroup}>
        <StreakCounter />
        <AverageRow />
        <StreakCalendar />
      </div>
    </div>
  );
}
