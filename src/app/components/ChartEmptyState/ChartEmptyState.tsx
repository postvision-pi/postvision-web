"use client";
import styles from "./ChartEmptyState.module.css";
import { Icon } from "@iconify/react";

interface ChartEmptyStateProps {
  loading?: boolean;
  message?: string;
}

const DEFAULT_MESSAGE =
  "Ainda não há treinos suficientes para gerar essa análise. Realize sua primeira sessão para ver essa estatística aqui.";

export default function ChartEmptyState({ loading = false, message }: ChartEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <Icon
        icon={loading ? "eos-icons:loading" : "mdi:chart-box-outline"}
        className={styles.icon}
      />
      <p className={styles.text}>
        {loading ? "Carregando estatísticas..." : message ?? DEFAULT_MESSAGE}
      </p>
    </div>
  );
}
