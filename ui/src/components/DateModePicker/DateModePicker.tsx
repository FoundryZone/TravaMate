import type { DateMode } from '@/types/itinerary';
import styles from './DateModePicker.module.css';

interface DateModePickerProps {
  mode: DateMode;
  onChange: (mode: DateMode) => void;
}

export default function DateModePicker({ mode, onChange }: DateModePickerProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.option} ${mode === 'exact' ? styles.active : ''}`}
        onClick={() => onChange('exact')}
        aria-pressed={mode === 'exact'}
      >
        <span className={styles.icon}>📅</span>
        Exact Dates
      </button>
      <button
        className={`${styles.option} ${mode === 'flexible' ? styles.active : ''}`}
        onClick={() => onChange('flexible')}
        aria-pressed={mode === 'flexible'}
      >
        <span className={styles.icon}>🕐</span>
        I&apos;m Flexible
      </button>
    </div>
  );
}
