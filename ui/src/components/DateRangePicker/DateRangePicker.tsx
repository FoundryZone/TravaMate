import 'react-day-picker/style.css';
import { DayPicker } from 'react-day-picker';
import type { DateRange as DayPickerRange } from 'react-day-picker';
import type { DateRange } from '@/types/itinerary';
import styles from './DateRangePicker.module.css';

interface DateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ range, onChange }: DateRangePickerProps) {
  function handleSelect(picked: DayPickerRange | undefined) {
    onChange({ from: picked?.from, to: picked?.to });
  }

  return (
    <div className={styles.wrapper}>
      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={range.from || range.to ? { from: range.from, to: range.to } : undefined}
        onSelect={handleSelect}
      />
    </div>
  );
}
