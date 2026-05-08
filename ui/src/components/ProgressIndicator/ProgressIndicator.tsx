import styles from './ProgressIndicator.module.css';

const STEP_LABELS = ['Travel Details', 'Destination', 'Cities & Route', 'Preferences'];

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepSummaries?: Record<number, string>;
}

export default function ProgressIndicator({ currentStep, totalSteps, stepSummaries }: ProgressIndicatorProps) {
  return (
    <nav className={styles.nav}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        const summary = isDone ? stepSummaries?.[step] : undefined;
        return (
          <div key={step} className={styles.step}>
            <div className={`${styles.circle} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}>
              {isDone ? '✓' : step}
            </div>
            <div className={styles.stepMeta}>
              <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
                {STEP_LABELS[i]}
              </span>
              {summary && <span className={styles.summary}>{summary}</span>}
            </div>
            {step < totalSteps && <div className={styles.connector} />}
          </div>
        );
      })}
    </nav>
  );
}
