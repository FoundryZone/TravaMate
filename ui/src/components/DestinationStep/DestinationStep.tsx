'use client';

import { useDestinationForm } from '@/hooks/useDestinationForm';
import DestinationPicker, { INDIA_DESTINATIONS } from '@/components/DestinationPicker/DestinationPicker';
import styles from './DestinationStep.module.css';

const ALL_PLACES = INDIA_DESTINATIONS.flatMap(g => g.places);

interface DestinationStepProps {
  onNext: (ids: string[]) => void;
  onBack: () => void;
}

export default function DestinationStep({ onNext, onBack }: DestinationStepProps) {
  const { state, toggleDestination, removeDestination, isNextEnabled } = useDestinationForm();

  const selectedPlaces = ALL_PLACES.filter(p => state.selectedIds.includes(p.id));

  return (
    <>
      <main className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Where are you going?</h2>
          <p className={styles.cardSubtitle}>Pick one or more destinations</p>

          <div className={`${styles.selectedBox} ${state.selectedIds.length > 0 ? styles.selectedBoxActive : ''}`}>
            {selectedPlaces.length === 0 ? (
              <span className={styles.placeholder}>Selected destinations will appear here</span>
            ) : (
              <div className={styles.pillsRow}>
                {selectedPlaces.map(place => (
                  <span key={place.id} className={styles.selectedPill}>
                    {place.emoji} {place.name}
                    <button
                      className={styles.removePill}
                      onClick={() => removeDestination(place.id)}
                      aria-label={`Remove ${place.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <DestinationPicker
            selectedIds={state.selectedIds}
            onToggle={toggleDestination}
          />
        </section>
      </main>

      <footer className={styles.footer}>
        <button className={styles.backBtn} onClick={onBack}>
          &lsaquo; Back
        </button>
        <button
          className={`${styles.nextBtn} ${isNextEnabled ? styles.nextEnabled : styles.nextDisabled}`}
          disabled={!isNextEnabled}
          onClick={() => onNext(state.selectedIds)}
        >
          Next &rsaquo;
        </button>
      </footer>
    </>
  );
}
