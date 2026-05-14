"use client";
import styles from "./Settings.module.css";
import RightBoard from "../../components/RightBoard/RightBoard";
import { Icon } from "@iconify/react";

export default function Settings() {
  return (
    <div className={styles.reverseContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.settingsContainer}>
          <div className={styles.title}>Configurações</div>
          <div className={styles.section}>
            <div className={styles.title}>Acessibilidade</div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Alterar tema</span>
              <label className={styles.switch}>
                <Icon icon="mynaui:sun-solid" className={styles.icon} />
                <Icon icon="mynaui:moon-solid" className={styles.icon} />
              </label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Tamanho da Fonte</span>
              <label className={styles.switch}>
                <span className={styles.smallFont}>Pequeno</span>
                <span className={styles.normalFont}>Normal</span>
                <span className={styles.bigFont}>Grande</span>
              </label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Idioma</span>
              <label className={styles.switch}>
                <Icon icon="fluent:open-12-regular" className={styles.icon}></Icon>
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>Privacidade e Dados</div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>
                Histórico de análises realizadas
              </span>
              <label className={styles.switch}>
                <Icon icon="mdi:eye" className={styles.icon} />
              </label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>
                Baixar Relatório de Desempenho
              </span>
              <label className={styles.switch}>
                <Icon icon="mynaui:download" className={styles.icon}></Icon>
              </label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Limpar dados de cache</span>
              <label className={styles.switch}>
                <Icon icon="ion:trash" className={styles.icon} />
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>Ajuda e Suporte</div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>FAQ</span>
              <label className={styles.switch}></label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Enviar feedback</span>
              <label className={styles.switch}></label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Reportar problema</span>
              <label className={styles.switch}></label>
            </div>
            <div className={styles.optionContainer}>
              <span className={styles.optionText}>Contato para Suporte</span>
              <label className={styles.switch}></label>
            </div>
          </div>
        </div>
      </div>
      <RightBoard />
    </div>
  );
}
