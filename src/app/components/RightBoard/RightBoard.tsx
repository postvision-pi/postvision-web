"use client";
import styles from "./RightBoard.module.css";
import StreakCalendar from "../StreakCalendar/SteakCalendar";
import AverageRow from "../AverageRow/AverageRow";
import StreakCounter from "../StreakCounter/StreakCounter";
import AppStatusRow from "../AppStatusRow/AppStatusRow";

export default function RightBoard() {
  return (
    <div className={styles.rightBoard}>
      <AppStatusRow/>
      <StreakCounter />
      <AverageRow />
      <StreakCalendar />
    </div>
  );
}
