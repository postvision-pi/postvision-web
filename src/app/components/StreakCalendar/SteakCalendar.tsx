"use client";
import styles from './StreakCalendar.module.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useSession } from '@/app/(dashboard)/SessionContext';

export default function StreakCalendar() {
  const { stats } = useSession();

  // Converte as datas de treino do banco em objetos Date
  // Usa new Date(date + 'T00:00:00') para evitar problema de fuso horário
  const trainedDays = stats?.monthly.map(
    (item) => new Date(item.date + 'T00:00:00')
  ) ?? [];

  return (
    <div className={styles.calendarBoard}>
      <div className={styles.calendarContainer}>
        <DayPicker
          locale={ptBR}
          mode="multiple"
          selected={trainedDays}
          disabled={{ before: new Date(2100, 0, 1) }}
          modifiersClassNames={{
            selected: styles.streakDay,
            today: styles.todayDay,
            weekend: styles.weekendDay,
            disabled: styles.disabledDay,
            outside: styles.outsideDay,
          }}
          weekStartsOn={0}
          showOutsideDays
          styles={{
            caption: { background: 'var(--secundary-purple-600)', color: 'var(--white)', borderRadius: '8px', padding: '4px 0', fontWeight: 600, margin: 20, opacity: 0.8 },
          }}
        />
      </div>
    </div>
  );
}
