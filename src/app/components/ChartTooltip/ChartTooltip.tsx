"use client";
import styles from "./ChartTooltip.module.css";

interface ChartTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string | number;
  /** unidade opcional exibida depois do valor, ex: "%" */
  unit?: string;
}

export default function ChartTooltip({ active, payload, label, unit = "" }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className={styles.tooltip}>
      {label !== undefined && <div className={styles.label}>{label}</div>}
      {payload.map((entry, index) => (
        <div key={index} className={styles.row}>
          <span
            className={styles.dot}
            style={{ backgroundColor: entry.color ?? entry.fill ?? "var(--brand-accent)" }}
          />
          <span className={styles.name}>{entry.name}:</span>
          <span className={styles.value}>
            {entry.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
