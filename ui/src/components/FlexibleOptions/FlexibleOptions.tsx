import type { FlexDuration, FlexibleOptions as FlexibleOptionsType } from '@/types/itinerary';
import styles from './FlexibleOptions.module.css';

const DURATIONS: FlexDuration[] = [7, 14, 21];

function getNextMonths(count: number): { key: string; label: string; year: number }[] {
  const now = new Date();
  const months = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short' });
    months.push({ key, label, year: d.getFullYear() });
  }
  return months;
}

const MONTHS = getNextMonths(12);

interface FlexibleOptionsProps {
  options: FlexibleOptionsType;
  onDurationChange: (duration: FlexDuration) => void;
  onMonthToggle: (month: string) => void;
}

export default function FlexibleOptions({
  options,
  onDurationChange,
  onMonthToggle,
}: FlexibleOptionsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>How long do you want to stay?</h3>
        <div className={styles.durationGrid}>
          {DURATIONS.map(d => (
            <button
              key={d}
              className={`${styles.durationOption} ${options.duration === d ? styles.selected : ''}`}
              onClick={() => onDurationChange(d)}
              aria-pressed={options.duration === d}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>When do you want to go?</h3>
        <p className={styles.cardSubtitle}>Select one or more months</p>
        <div className={styles.monthGrid}>
          {MONTHS.map(({ key, label, year }) => (
            <button
              key={key}
              className={`${styles.monthOption} ${options.months.includes(key) ? styles.selected : ''}`}
              onClick={() => onMonthToggle(key)}
              aria-pressed={options.months.includes(key)}
            >
              <span className={styles.monthLabel}>{label}</span>
              <span className={styles.monthYear}>{year}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
