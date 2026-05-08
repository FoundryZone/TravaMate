export type Occasion = 'leisure' | 'birthday' | 'anniversary' | 'honeymoon';

export type DateMode = 'exact' | 'flexible';

export interface TravelerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export type FlexDuration = 7 | 14 | 21;

export interface FlexibleOptions {
  duration: FlexDuration | null;
  months: string[];
}

export interface TravelDetailsState {
  travelers: TravelerCounts;
  occasion: Occasion | null;
  dateMode: DateMode;
  dateRange: DateRange;
  flexibleOptions: FlexibleOptions;
}
