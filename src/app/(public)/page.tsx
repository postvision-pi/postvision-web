"use client";
import Image from "next/image";
import styles from "./home.module.css";
import Navbar from "../components/Navbar/Navbar";
import MobileHomeScreen from '@/../public/images/mobile-home-screen.png';
import { Icon } from '@iconify/react';
import LogoMaior from '@/../public/images/logo-maior.svg';
import iconPostvision from '@/../public/images/logo-purple.svg';
import { useState } from "react";
import Celular from '@/../public/images/celular-postvision.png';
import FeedbackChart from "@/app/components/exampleCharts/Charts";
import LastTrainingCharts from "@/app/components/exampleCharts/LastTrainingChart/LastTrainingChart";
import MonthlyComparisionChart from "@/app/components/exampleCharts/MonthlyComparisionChart/MonthlyComparisionChart";
import WeeklyPerformanceChart from "@/app/components/exampleCharts/WeeklyPerformanceChart/WeeklyPerformanceChart";
import Footer from "@/app/components/Footer";

const steps = [
  {
    num: "1",
    title: "Entre no PostVision e escolha o exercício",
    icon: "mdi:cellphone",
  },
  {
    num: "2",
    title: "Deixe o corpo inteiro visível na câmera",
    icon: "mdi:human-greeting",
  },
  {
    num: "3",
    title: "Inicie a sessão e realize o movimento",
    icon: "mdi:play-circle",
  },
  {
    num: "4",
    title: "Veja sua análise e dicas para melhorar",
    icon: "gridicons:stats",
  },
];

const feedbackItems = [
  { icon: "mdi:chart-bar", text: "Desempenho por treino e semana" },
  { icon: "mdi:trending-up", text: "Comparativo de evolução" },
  { icon: "mdi:message-text", text: "Feedback técnico personalizado" },
  { icon: "mdi:lightbulb", text: "Dicas para melhorar sua postura" },
];

export default function Home() {
  const [chartsOpen, setChartsOpen] = useState(false);

  return (
    <div className={styles.homePage}>
      <Navbar />
      <div className={styles.homeContainer}>
        <div className={styles.textContent}>
          <div className={styles.date}>
            Tecnologia que cuida do seu treino
          </div>
          <div className={styles.title}>
            Melhore sua Postura e Desempenho com Análise Inteligente
          </div>
          <div className={styles.description}>
            Utilizamos visão computacional para avaliar sua postura durante os exercícios, promovendo treinos mais seguros e eficientes.
          </div>
          <div className={styles.homeButtons}>
            <div className={`${styles.button} ${styles.goToPostVision}`}>Ir para PostVision</div>
            <div className={`${styles.button} ${styles.downloadApp}`}>
              Baixar nosso app
              <Icon icon='material-symbols-light:download' width={32} height={32}></Icon>
            </div>
          </div>
        </div>
        <div className={styles.imageContent}>
          <Image
            src={MobileHomeScreen}
            alt="Tela inicial do aplicativo PostVision"
            className={styles.img}
          />
        </div>
      </div>

      <section className={styles.aboutSection} id="Sobre">
        <div className={styles.aboutContent}>

          <div className={styles.titleContent}>
            <h1 className={styles.title}>Por que usar o PostVision?</h1>
            <hr className={styles.hr} />
          </div>
          <div className={styles.gridAbout}>

            <div className={`${styles.cardAbout} hover:scale-105 transition-transform duration-300`}>
              <div className={styles.icon}>
                <Image src={iconPostvision} alt="icone do PostVision" />
              </div>
              <p className={styles.titleCard}>Correção automática</p>
              <p className={styles.descriptionCard}>Obtenha feedback em tempo real sobre sua postura durante os exercícios.</p>
            </div>

            <div className={`${styles.cardAbout} hover:scale-105 transition-transform duration-300`}>
              <div className={styles.icon}>
                <Icon icon="lucide:brain" width={24} height={24} />
              </div>
              <p className={styles.titleCard}>Feedback inteligente</p>
              <p className={styles.descriptionCard}>Nossa IA entende seus movimentos e entrega orientações práticas..</p>
            </div>

            <div className={`${styles.cardAbout} hover:scale-105 transition-transform duration-300`}>
              <div className={styles.icon}>
                <Icon icon="healthicons:health-outline-24px" width={24} height={24} />
              </div>
              <p className={styles.titleCard}>Mais segurança</p>
              <p className={styles.descriptionCard}>Treine com mais confiança e reduza o risco de lesões por má postura.</p>
            </div>

            <div className={`${styles.cardAbout} hover:scale-105 transition-transform duration-300`}>
              <div className={styles.icon}>
                <Icon icon="gridicons:stats" width={24} height={24} />
              </div>
              <p className={styles.titleCard}>Evolução contínua</p>
              <p className={styles.descriptionCard}>Acompanhe seu progresso ao longo do tempo e supere seus limites.</p>
            </div>

          </div>

          <div className="mb-16 mt-32">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-8">Como Funciona?</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-4 transition-transform duration-300 hover:scale-110">
                  <div className="flex flex-col items-center text-center max-w-[160px]">
                    <div
                      className="w-13 h-13 rounded-xl flex items-center justify-center mb-3 relative"
                      style={{ background: "#0d0f24", border: "1px solid #1e2040" }}
                    >
                      <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                        {step.num}
                      </span>
                      <Icon icon={step.icon} className="text-white" width={28} />
                    </div>
                    <p className="text-sm text-[#333333] leading-tight">{step.title}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <Icon
                      icon="mdi:arrow-right"
                      className="text-slate-600 hidden md:block flex-shrink-0"
                      width={20}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* App showcase */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16" id="Aplicativo">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Veja sua evolução na prática</h3>
              <p className="text-[#333333] text-sm mb-6">
                Dados reais do seu treino, analisados em tempo real.
              </p>
              <div className="space-y-3">
                {feedbackItems.map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:check" className="text-white" width={12} />
                    </div>
                    <span className="text-[#333333] text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-56 transition-transform duration-300 hover:scale-105">
                <Image
                  src={Celular}
                  alt="PostVision App"
                  width={224}
                  height={448}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Charts accordion */}
          <div className="rounded-2xl overflow-hidden border border-slate-200" id="Analises">
            {/* Accordion header — always visible */}
            <button
              onClick={() => setChartsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Icon icon="mdi:chart-bar" className="text-blue-600" width={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Análises e Gráficos</p>
                  <p className="text-xs text-[#333333]">
                    Último treino, desempenho semanal, comparativo mensal e feedback
                  </p>
                </div>
              </div>
              <Icon
                icon={chartsOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="text-slate-500 transition-transform flex-shrink-0"
                width={22}
              />
            </button>

            {/* Accordion body — collapsible */}
            <div
              className="overflow-hidden transition-all duration-400 ease-in-out"
              style={{ maxHeight: chartsOpen ? "800px" : "0px" }}
            >
              <div className="bg-slate-50 px-6 py-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <LastTrainingCharts />
                  <WeeklyPerformanceChart />
                  <MonthlyComparisionChart />
                  <FeedbackChart />
                </div>
              </div>
            </div>
          </div>






        </div>
      </section>
      <Footer />
    </div>
  );
}
