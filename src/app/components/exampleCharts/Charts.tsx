"use client";

import { Icon } from "@iconify/react";

export default function FeedbackChart() {
  return (
    <div
      className="rounded-xl p-5 bg-white border border-[#e2e8f0]">
      <p className="text-[1.1rem] font-bold text-[#1a1a2e]">Feedback do usuário</p>
      <p className="text-[0.875rem] font-regular text-[#64748b] mb-3">Feedback do usuário</p>
      <div className="space-y-3">
        <div
          className="flex items-start gap-2 p-2 rounded-lg"
          style={{ background: "#f1f1f1" }}
        >
          <Icon
            icon="mdi:alert-circle"
            className="text-blue-800 mt-0.5 flex-shrink-0"
            width={14}
          />
          <div>
            <p className="text-xs font-medium text-[#1a1a2e]">Ajustes Necessários</p>
            <p className="text-xs text-[#64748b]">Joelhos passando muito à frente</p>
            <p className="text-xs text-[#64748b]">Quadril não paralelo ao chão</p>
          </div>
        </div>
        <div
          className="flex items-start gap-2 p-2 rounded-lg"
          style={{ background: "#f1f1f1" }}
        >
          <Icon
            icon="mdi:lightbulb"
            className="text-blue-800 mt-0.5 flex-shrink-0"
            width={14}
          />
          <div>
            <p className="text-xs font-medium text-[#1a1a2e]">Dicas</p>
            <p className="text-xs text-[#64748b]">
              Mantenha os joelhos alinhados e o peso sobre os calcanhares.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
