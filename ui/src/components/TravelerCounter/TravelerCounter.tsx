import styles from './TravelerCounter.module.css';

interface TravelerCounterProps {
  label: string;
  subLabel: string;
  count: number;
  min: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function TravelerCounter({
  label,
  subLabel,
  count,
  min,
  onIncrement,
  onDecrement,
}: TravelerCounterProps) {
  return (
    <div className={styles.counter}>
      <div className={styles.controls}>
        <button
          className={styles.btnMinus}
          onClick={onDecrement}
          disabled={count <= min}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className={styles.count}>{count}</span>
        <button
          className={styles.btnPlus}
          onClick={onIncrement}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
      <span className={styles.label}>{label}</span>
      <span className={styles.subLabel}>{subLabel}</span>
    </div>
  );
}
