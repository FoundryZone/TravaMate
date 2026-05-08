import type { StateGroup } from '@/types/destination';
import styles from './DestinationPicker.module.css';

export const INDIA_DESTINATIONS: StateGroup[] = [
  {
    state: 'Maharashtra',
    places: [
      { id: 'pune',   name: 'Pune',   emoji: '🏙️' },
      { id: 'mumbai', name: 'Mumbai', emoji: '🌆' },
    ],
  },
  {
    state: 'Himachal Pradesh',
    places: [
      { id: 'spiti-valley', name: 'Spiti Valley', emoji: '🏔️' },
      { id: 'manali',       name: 'Manali',        emoji: '⛰️' },
    ],
  },
];

interface DestinationPickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function DestinationPicker({ selectedIds, onToggle }: DestinationPickerProps) {
  return (
    <div className={styles.wrapper}>
      {INDIA_DESTINATIONS.map(({ state, places }) => (
        <div key={state} className={styles.stateGroup}>
          <p className={styles.stateLabel}>{state}</p>
          <div className={styles.placeRow}>
            {places.map(place => {
              const isSelected = selectedIds.includes(place.id);
              return (
                <button
                  key={place.id}
                  className={`${styles.placePill} ${isSelected ? styles.pillSelected : ''}`}
                  onClick={() => onToggle(place.id)}
                  aria-pressed={isSelected}
                >
                  <span className={styles.pillEmoji}>{place.emoji}</span>
                  <span className={styles.pillName}>{place.name}</span>
                  {isSelected && <span className={styles.pillCheck}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
