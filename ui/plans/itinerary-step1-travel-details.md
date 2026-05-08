# TravaMate UI — Itinerary Step 1: Travel Details

## Context
Building Step 1 of a 4-step itinerary form for the TravaMate MVP. The UI project is a clean-slate Next.js 16 (App Router) + TypeScript project with CSS Modules and no component library. Only Step 1 (Travel Details) is in scope — Steps 2-4 are future work.

---

## Install
```
cd ui && npm install react-day-picker
```

---

## File Manifest

### Create
```
src/types/itinerary.ts
src/hooks/useTravelDetailsForm.ts
src/components/ProgressIndicator/ProgressIndicator.tsx
src/components/ProgressIndicator/ProgressIndicator.module.css
src/components/TravelerCounter/TravelerCounter.tsx
src/components/TravelerCounter/TravelerCounter.module.css
src/components/OccasionPicker/OccasionPicker.tsx
src/components/OccasionPicker/OccasionPicker.module.css
src/components/DateModePicker/DateModePicker.tsx
src/components/DateModePicker/DateModePicker.module.css
src/components/DateRangePicker/DateRangePicker.tsx
src/components/DateRangePicker/DateRangePicker.module.css
src/components/FlexibleOptions/FlexibleOptions.tsx
src/components/FlexibleOptions/FlexibleOptions.module.css
src/components/TravelDetailsForm/TravelDetailsForm.tsx
src/components/TravelDetailsForm/TravelDetailsForm.module.css
```

### Modify
```
src/app/page.tsx        — render <TravelDetailsForm /> (keep as Server Component)
src/app/layout.tsx      — title → "TravaMate"
src/app/globals.css     — add CSS design tokens
```

---

## TypeScript Types — `src/types/itinerary.ts`
```ts
export type Occasion = 'leisure' | 'birthday' | 'anniversary' | 'honeymoon';
export type DateMode = 'exact' | 'flexible';
export type FlexDuration = 7 | 14 | 21;

export interface TravelerCounts {
  adults: number;    // min 1
  children: number;  // min 0
  infants: number;   // min 0
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FlexibleOptions {
  duration: FlexDuration | null;
  months: string[]; // e.g. "2026-05"
}

export interface TravelDetailsState {
  travelers: TravelerCounts;
  occasion: Occasion | null;
  dateMode: DateMode;
  dateRange: DateRange;
  flexibleOptions: FlexibleOptions;
}
```

---

## State Hook — `src/hooks/useTravelDetailsForm.ts`
- `'use client'`
- Owns all `useState` for the form
- Exposes: `state`, `setTravelerCount(key, delta)`, `setOccasion`, `setDateMode`, `setDateRange`, `setFlexDuration`, `toggleFlexMonth`
- Derives `isNextEnabled` (pure boolean, no `useEffect`):
  ```ts
  const isNextEnabled =
    state.travelers.adults >= 1 &&
    state.occasion !== null &&
    (
      (state.dateMode === 'exact' && state.dateRange.from !== undefined && state.dateRange.to !== undefined) ||
      (state.dateMode === 'flexible' && state.flexibleOptions.duration !== null && state.flexibleOptions.months.length > 0)
    );
  ```
- `setDateMode` resets both `dateRange` and `flexibleOptions` on mode change

---

## Component Hierarchy

```
page.tsx (Server Component)
  └── TravelDetailsForm ('use client' — single client boundary)
        ├── ProgressIndicator        props: currentStep=1, totalSteps=4
        ├── [card] Who's Traveling?
        │     ├── TravelerCounter    Adults (min=1)
        │     ├── TravelerCounter    Children (min=0)
        │     └── TravelerCounter    Infants (min=0)
        ├── [card] What's the Occasion?
        │     └── OccasionPicker     selected, onSelect
        └── [card] When do you want to travel?
              ├── DateModePicker     mode, onChange
              ├── DateRangePicker    (rendered only when mode==='exact')
              └── FlexibleOptions    (rendered only when mode==='flexible')
                    ├── Duration cards: 7 / 14 / 21 days
                    └── Month grid: next 12 months (multi-select)
        └── <button> Next >          disabled={!isNextEnabled}
```

---

## CSS Design Tokens (in `src/app/globals.css` `:root`)
```css
--color-primary: #7C3AED;
--color-primary-hover: #6D28D9;
--color-primary-light: #EDE9FE;
--color-border: #E5E7EB;
--color-text-muted: #6B7280;
--color-card-bg: #FFFFFF;
--radius-card: 12px;
--radius-pill: 999px;
```

---

## Next Button States
- **Disabled**: `--color-primary-light` background, `cursor: not-allowed`, `opacity: 0.7`, `pointer-events: none`
- **Enabled**: `--color-primary` background, white text

---

## Key Implementation Notes
- `DateRangePicker` uses `:global()` CSS selectors to override react-day-picker's internal styles — not the `classNames` prop. This ensures the day button base background is transparent and only selected/range states apply purple.
- `FlexibleOptions` generates the next 12 months dynamically from the current date using `getNextMonths()`.
- `page.tsx` stays a Server Component; only `TravelDetailsForm` has `'use client'`. All child components inherit client-side rendering through this boundary.

---

## Verification
- `npm run dev` — visit http://localhost:3000
- Adults counter: cannot decrement below 1; Children/Infants can go to 0
- Next button disabled by default (no occasion, no dates)
- **Exact Dates mode**: pick a date range → Next enables
- **Flexible mode**: select a duration AND at least one month → Next enables
- Switching modes resets the previous selection
- `npm run build` — no TypeScript errors
