import type { Occasion } from '@/types/itinerary';
import styles from './OccasionPicker.module.css';

const OCCASIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: 'leisure', label: 'Leisure', emoji: '🏖️' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💝' },
  { id: 'honeymoon', label: 'Honeymoon', emoji: '🎊' },
];

interface OccasionPickerProps {
  selected: Occasion | null;
  onSelect: (occasion: Occasion) => void;
}

export default function OccasionPicker({ selected, onSelect }: OccasionPickerProps) {
  return (
    <div className={styles.wrapper}>
      {OCCASIONS.map(({ id, label, emoji }) => (
        <button
          key={id}
          className={`${styles.pill} ${selected === id ? styles.selected : ''}`}
          onClick={() => onSelect(id)}
          aria-pressed={selected === id}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
