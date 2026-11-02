import type { SessionStats } from "@/app/(dashboard)/SessionContext";

export const stats: SessionStats = {
  streak: 3, avgDuration: 240, avgAccuracy: 80,
  weekly: [{ date: "2026-10-28T12:00:00Z", corretos: 25, total: 40 }],
  monthly: [{ date: "2026-10-28", totalReps: 25 }],
  lastSession: { date: "2026-10-28", corretos: 8, incorretos: 2, total: 10, accuracy: 80 },
};

export const notification = {
  _id: "n1", type: "reminder", title: "Hora do treino", message: "Seu treino está disponível",
  read: false, createdAt: "2026-10-28T12:00:00Z",
};
