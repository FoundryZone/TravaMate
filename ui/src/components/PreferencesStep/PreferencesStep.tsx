'use client';

import { usePreferencesForm } from '@/hooks/usePreferencesForm';
import BudgetRangePicker from '@/components/BudgetRangePicker/BudgetRangePicker';
import type { DietaryOption } from '@/types/preferences';
import styles from './PreferencesStep.module.css';

const DIETARY_OPTIONS: { value: DietaryOption; label: string }[] = [
  { value: 'veg',     label: 'Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
  { value: 'both',    label: 'Both' },
];

interface PreferencesStepProps {
  onSubmit: () => void;
  onBack: () => void;
}

export default function PreferencesStep({ onSubmit, onBack }: PreferencesStepProps) {
  const { state, setBudgetMin, setBudgetMax, setDietary, setNotes, isNextEnabled } =
    usePreferencesForm();

  return (
    <>
      <main className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Preferred Stay Budget Range</h2>
          <BudgetRangePicker
            min={state.budgetMin}
            max={state.budgetMax}
            onMinChange={setBudgetMin}
            onMaxChange={setBudgetMax}
          />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Any dietary requirements?</h2>
          <div className={styles.pillRow}>
            {DIETARY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`${styles.pill} ${state.dietary === opt.value ? styles.pillSelected : ''}`}
                onClick={() => setDietary(opt.value)}
                aria-pressed={state.dietary === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Anything else we should know?</h2>
          <div className={styles.textareaWrapper}>
            <span className={styles.textareaIcon}>✨</span>
            <textarea
              className={styles.textarea}
              value={state.notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Share any interests, requirements or things to avoid."
              rows={4}
              aria-label="Additional notes"
            />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          &lsaquo; Back
        </button>
        <p className={styles.disclaimer}>
          TravaMate AI is in beta, some results may not be fully accurate.
          <br />
          This may take up to 2 minutes.
        </p>
        <button
          className={`${styles.submitBtn} ${isNextEnabled ? styles.submitEnabled : styles.submitDisabled}`}
          disabled={!isNextEnabled}
          onClick={onSubmit}
        >
          ✨ Plan my itinerary
        </button>
      </footer>
    </>
  );
}
