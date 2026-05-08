import styles from './BudgetRangePicker.module.css';

interface BudgetRangePickerProps {
  min: string;
  max: string;
  onMinChange: (val: string) => void;
  onMaxChange: (val: string) => void;
}

export default function BudgetRangePicker({
  min,
  max,
  onMinChange,
  onMaxChange,
}: BudgetRangePickerProps) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label}>Min</label>
        <div className={styles.inputWrapper}>
          <span className={styles.currency}>₹</span>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            value={min}
            onChange={e => onMinChange(e.target.value)}
            placeholder="0"
            aria-label="Minimum budget"
          />
        </div>
      </div>

      <span className={styles.separator}>—</span>

      <div className={styles.field}>
        <label className={styles.label}>Max</label>
        <div className={styles.inputWrapper}>
          <span className={styles.currency}>₹</span>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            value={max}
            onChange={e => onMaxChange(e.target.value)}
            placeholder="0"
            aria-label="Maximum budget"
          />
        </div>
      </div>
    </div>
  );
}
