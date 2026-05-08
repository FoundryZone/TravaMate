# TravaMate UI — Itinerary Step 2: Destination

## Context
Step 2 of the 4-step itinerary MVP. Introduces multi-step navigation: a new `ItineraryForm` orchestrator manages which step is shown and carries the Step 1 date summary into the progress indicator. India-only for MVP — Maharashtra (Pune, Mumbai) and Himachal Pradesh (Spiti Valley, Manali).

---

## File Manifest

### Create
```
src/types/destination.ts
src/hooks/useDestinationForm.ts
src/components/ItineraryForm/ItineraryForm.tsx
src/components/ItineraryForm/ItineraryForm.module.css
src/components/DestinationStep/DestinationStep.tsx
src/components/DestinationStep/DestinationStep.module.css
src/components/DestinationPicker/DestinationPicker.tsx
src/components/DestinationPicker/DestinationPicker.module.css
```

### Rename
```
TravelDetailsForm/ → TravelDetailsStep/  (both .tsx and .module.css)
```

### Modify
```
src/components/TravelDetailsStep/TravelDetailsStep.tsx  — add onNext prop, remove ProgressIndicator, add formatSummary, remove outer .page wrapper
src/components/ProgressIndicator/ProgressIndicator.tsx — add stepSummaries prop, ✓ for done steps, summary pill
src/components/ProgressIndicator/ProgressIndicator.module.css — add .stepMeta, .summary
src/app/page.tsx                                       — render ItineraryForm instead of TravelDetailsForm
```

---

## TypeScript Types

**`src/types/destination.ts`**
```ts
export interface Place {
  id: string;
  name: string;
  emoji: string;
}

export interface StateGroup {
  state: string;
  places: Place[];
}

export interface DestinationState {
  selectedIds: string[];
}
```

---

## Static Data (inside DestinationPicker.tsx, exported)
```ts
export const INDIA_DESTINATIONS: StateGroup[] = [
  { state: 'Maharashtra', places: [
    { id: 'pune', name: 'Pune', emoji: '🏙️' },
    { id: 'mumbai', name: 'Mumbai', emoji: '🌆' },
  ]},
  { state: 'Himachal Pradesh', places: [
    { id: 'spiti-valley', name: 'Spiti Valley', emoji: '🏔️' },
    { id: 'manali', name: 'Manali', emoji: '⛰️' },
  ]},
]
```

---

## Hook — `src/hooks/useDestinationForm.ts`
```ts
'use client'
- useState<DestinationState>({ selectedIds: [] })
- toggleDestination(id): add if absent, remove if present
- removeDestination(id): filter-only remove (used by selected-pills × button)
- isNextEnabled: selectedIds.length > 0
```

---

## Architecture

```
page.tsx (Server Component)
  └── ItineraryForm ('use client' — orchestrator)
        ├── manages currentStep: 1 | 2
        ├── manages step1Summary: string
        ├── ProgressIndicator  (shared, always visible)
        ├── [step 1] TravelDetailsStep
        │     - accepts onNext: (summary: string) => void
        │     - calls onNext(formatSummary(state)) on Next click
        └── [step 2] DestinationStep
              - accepts onNext: () => void, onBack: () => void
              - Back resets to step 1
```

**`formatSummary` (in TravelDetailsStep.tsx):**
```ts
function formatSummary(state: TravelDetailsState): string {
  if (state.dateMode === 'flexible') return 'Flexible';
  if (state.dateRange.from && state.dateRange.to) {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(state.dateRange.from)} – ${fmt(state.dateRange.to)}`;
  }
  return '';
}
```

---

## ProgressIndicator changes
- New prop: `stepSummaries?: Record<number, string>`
- Done steps (step < currentStep): show `✓` in circle instead of number
- Wrap label + summary in `.stepMeta` (flex column) so summary pill sits below label
- Summary pill only renders when `isDone && stepSummaries?.[step]` is truthy

```
.step (flex row)
  ├── .circle  (✓ or number)
  ├── .stepMeta (flex column)
  │     ├── .label
  │     └── .summary (conditional pill)
  └── .connector
```

---

## DestinationStep UI Layout
```
<main>
  [card]
    "Where are you going?"
    "Pick one or more destinations"
    [selectedBox]  ← purple border when active; shows selected as dismissible pills
    [DestinationPicker]  ← state groups + place pills
<footer>
  [Back btn]  ←—————————————→  [Next btn]
```

- Footer uses `justify-content: space-between`
- Next disabled until `selectedIds.length > 0`
- Each place pill: emoji + name + ✓ when selected (purple border + light bg)

---

## Implementation Order
1. `src/types/destination.ts`
2. `src/hooks/useDestinationForm.ts`
3. Rename TravelDetailsForm → TravelDetailsStep (add `onNext` prop, add `formatSummary`, remove ProgressIndicator + outer `.page` wrapper)
4. Update ProgressIndicator (stepSummaries, done/checkmark, summary pill)
5. `DestinationPicker` component (export INDIA_DESTINATIONS)
6. `DestinationStep` component (imports INDIA_DESTINATIONS for pill lookup)
7. `ItineraryForm` (orchestrator, manages step + step1Summary)
8. `src/app/page.tsx` → render `<ItineraryForm />`

---

## Verification
- Step 1 renders identically to before
- Click Next on Step 1 → navigates to Step 2
- Progress bar: Step 1 shows ✓ + date summary pill, Step 2 is active (purple)
- Step 2: clicking a destination pill selects it (purple border + ✓ + appears in box)
- Multiple destinations can be selected
- × on a selected pill deselects it from both box and grid
- Next button enabled only when ≥1 destination selected
- Back button returns to Step 1 (ProgressIndicator resets to step 1 active)
- `npm run build` — zero TypeScript errors
