"use client";
import { useState } from "react";
import styles from "./Settings.module.css";
import RightBoard from "../../components/RightBoard/RightBoard";
import { Icon } from "@iconify/react";
import { useAppSettings, FontSize, Language } from "@/app/context/AppSettingsContext";
import { useUser } from "../UserContext";
import { apiGetSessionStatsByUserId, apiGetSessionsByUserId } from "@/lib/api";
import HistoryModal from "@/app/components/HistoryModal/HistoryModal";

const SUPPORT_EMAIL = "analisepostural@gmail.com";

type CacheStatus = "idle" | "clearing" | "done";
type DownloadStatus = "idle" | "loading" | "error";

export default function Settings() {
  const { theme, setTheme, fontSize, setFontSize, language, setLanguage, t } = useAppSettings();
  const usuario = useUser();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle");

  function handleClearCache() {
    if (cacheStatus === "clearing") return;
    setCacheStatus("clearing");

    try {
      sessionStorage.clear();

      const keepKeys = new Set(["token", "usuario", "pv_theme", "pv_font_size", "pv_language"]);
      Object.keys(localStorage)
        .filter((key) => !keepKeys.has(key))
        .forEach((key) => localStorage.removeItem(key));

      if (typeof caches !== "undefined") {
        caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
      }
    } catch {
      // ignora se alguma dessas APIs não existir no navegador
    }

    setTimeout(() => {
      setCacheStatus("done");
      setTimeout(() => setCacheStatus("idle"), 2000);
    }, 500);
  }

  async function handleDownloadReport() {
    if (!usuario?.id_usuario || downloadStatus === "loading") return;
    setDownloadStatus("loading");

    try {
      const [statsRes, sessionsRes] = await Promise.all([
        apiGetSessionStatsByUserId(usuario.id_usuario),
        apiGetSessionsByUserId(usuario.id_usuario),
      ]);

      const stats = statsRes.ok ? await statsRes.json() : null;
      const sessions = sessionsRes.ok ? await sessionsRes.json() : [];

      const lines: string[] = [];
      lines.push("RELATÓRIO DE DESEMPENHO — POSTVISION");
      lines.push(`Usuário: ${usuario.nome_usuario} ${usuario.sobrenome_usuario}`);
      lines.push(`Gerado em: ${new Date().toLocaleString("pt-BR")}`);
      lines.push("");
      lines.push("── RESUMO ──────────────────────────");

      if (stats) {
        lines.push(`Streak atual: ${stats.streak ?? 0} dia(s)`);
        if (typeof stats.avgDuration === "number") {
          lines.push(`Duração média das sessões: ${Math.round(stats.avgDuration)}s`);
        }
        if (typeof stats.avgAccuracy === "number") {
          lines.push(`Precisão média: ${Math.round(stats.avgAccuracy)}%`);
        }
      } else {
        lines.push("Estatísticas indisponíveis no momento.");
      }

      lines.push("");
      lines.push("── HISTÓRICO DE SESSÕES ────────────");

      if (Array.isArray(sessions) && sessions.length > 0) {
        sessions
          .slice()
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .forEach((session: any) => {
            const date = new Date(session.date).toLocaleDateString("pt-BR");
            const correct = session.report?.correctReps ?? 0;
            const incorrect = session.report?.incorrectReps ?? 0;
            const accuracy = Math.round(session.report?.averageAccuracy ?? 0);
            lines.push(
              `${date} — Corretas: ${correct} | Incorretas: ${incorrect} | Precisão: ${accuracy}%`
            );
          });
      } else {
        lines.push("Nenhuma sessão registrada.");
      }

      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-postvision-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDownloadStatus("idle");
    } catch {
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 2500);
    }
  }

  return (
    <div className={styles.reverseContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.settingsContainer}>
          <div className={styles.title}>{t("settings.title")}</div>

          <div className={styles.section}>
            <div className={styles.title}>{t("settings.section.accessibility")}</div>

            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.theme")}</span>
              <div className={styles.themeSwitch}>
                <button
                  type="button"
                  className={`${styles.themeButton} ${theme === "light" ? styles.themeButtonActive : ""}`}
                  onClick={() => setTheme("light")}
                  aria-label={t("settings.theme.light")}
                >
                  <Icon icon="mynaui:sun-solid" className={styles.icon} />
                </button>
                <button
                  type="button"
                  className={`${styles.themeButton} ${theme === "dark" ? styles.themeButtonActive : ""}`}
                  onClick={() => setTheme("dark")}
                  aria-label={t("settings.theme.dark")}
                >
                  <Icon icon="mynaui:moon-solid" className={styles.icon} />
                </button>
              </div>
            </div>

            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.fontSize")}</span>
              <select
                className={styles.select}
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
              >
                <option value="small">{t("settings.fontSize.small")}</option>
                <option value="normal">{t("settings.fontSize.normal")}</option>
                <option value="large">{t("settings.fontSize.large")}</option>
              </select>
            </div>

            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.language")}</span>
              <select
                className={styles.select}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>{t("settings.section.privacy")}</div>

            <button type="button" className={styles.optionContainer} onClick={() => setHistoryOpen(true)}>
              <span className={styles.optionText}>{t("settings.history")}</span>
              <label className={styles.switch}>
                <Icon icon="mdi:eye" className={styles.icon} />
              </label>
            </button>

            <button
              type="button"
              className={styles.optionContainer}
              onClick={handleDownloadReport}
              disabled={downloadStatus === "loading"}
            >
              <span className={styles.optionText}>
                {downloadStatus === "loading"
                  ? t("settings.downloadPreparing")
                  : downloadStatus === "error"
                  ? t("settings.downloadError")
                  : t("settings.download")}
              </span>
              <label className={styles.switch}>
                <Icon icon="mynaui:download" className={styles.icon}></Icon>
              </label>
            </button>

            <button type="button" className={styles.optionContainer} onClick={handleClearCache}>
              <span className={styles.optionText}>
                {cacheStatus === "clearing"
                  ? t("settings.cacheClearing")
                  : cacheStatus === "done"
                  ? t("settings.cacheCleared")
                  : t("settings.clearCache")}
              </span>
              <label className={styles.switch}>
                <Icon icon="ion:trash" className={styles.icon} />
              </label>
            </button>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>{t("settings.section.support")}</div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.faq")}</span>
              <label className={styles.switch}></label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.feedback")}</span>
              <label className={styles.switch}></label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>{t("settings.report")}</span>
              <label className={styles.switch}></label>
            </div>
            <a
              className={styles.optionContainer}
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              <span className={styles.optionText}>{t("settings.contact")}</span>
              <span className={styles.supportEmail}>{SUPPORT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>
      <RightBoard hideStatsOnMobile />

      {historyOpen && <HistoryModal onClose={() => setHistoryOpen(false)} />}
    </div>
  );
}
