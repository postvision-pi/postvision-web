"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./HistoryModal.module.css";
import { apiGetSessionsByUserId } from "@/lib/api";
import { useUser } from "@/app/(dashboard)/UserContext";
import { useAppSettings } from "@/app/context/AppSettingsContext";

interface SessionItem {
  _id: string;
  date: string;
  durationInSeconds: number;
  exerciseId?: { name?: string } | string;
  report?: {
    correctReps?: number;
    incorrectReps?: number;
    averageAccuracy?: number;
  };
}

const dateFormatters: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

export default function HistoryModal({ onClose }: { onClose: () => void }) {
  const usuario = useUser();
  const { t, language } = useAppSettings();

  const [sessions, setSessions] = useState<SessionItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!usuario?.id_usuario) return;

    apiGetSessionsByUserId(usuario.id_usuario)
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      })
      .catch(() => setError(true));
  }, [usuario?.id_usuario]);

  const locale = dateFormatters[language] ?? "pt-BR";

  function exerciseName(session: SessionItem) {
    if (session.exerciseId && typeof session.exerciseId === "object") {
      return session.exerciseId.name ?? "—";
    }
    return "—";
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}min ${s}s`;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>{t("history.title")}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label={t("history.close")}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div className={styles.body}>
          {error && <div className={styles.message}>{t("history.error")}</div>}

          {!error && sessions === null && (
            <div className={styles.message}>{t("history.loading")}</div>
          )}

          {!error && sessions !== null && sessions.length === 0 && (
            <div className={styles.message}>{t("history.empty")}</div>
          )}

          {!error &&
            sessions !== null &&
            sessions
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((session) => (
                <div key={session._id} className={styles.sessionCard}>
                  <div className={styles.sessionHeader}>
                    <span className={styles.sessionExercise}>{exerciseName(session)}</span>
                    <span className={styles.sessionDate}>
                      {new Date(session.date).toLocaleDateString(locale)}
                    </span>
                  </div>
                  <div className={styles.sessionStats}>
                    <span>
                      {t("history.duration")}: {formatDuration(session.durationInSeconds)}
                    </span>
                    <span className={styles.correct}>
                      {t("history.correct")}: {session.report?.correctReps ?? 0}
                    </span>
                    <span className={styles.incorrect}>
                      {t("history.incorrect")}: {session.report?.incorrectReps ?? 0}
                    </span>
                    <span>
                      {t("history.accuracy")}: {Math.round(session.report?.averageAccuracy ?? 0)}%
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
