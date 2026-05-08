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
