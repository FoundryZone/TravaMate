export type DietaryOption = 'veg' | 'non-veg' | 'both';

export interface PreferencesState {
  budgetMin: string;
  budgetMax: string;
  dietary: DietaryOption | null;
  notes: string;
}
