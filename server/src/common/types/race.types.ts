// Common enums used across the application
export enum RaceStage {
  INITIALIZE = 1,
  PRELIMINARY = 10,
  SEMIFINAL = 20,
  FINAL = 30,
  PRELIM_DEADHEAT = 40,
  SEMI_DEADHEAT = 50
}

export enum RacerType {
  CUB = 'cub',
  SIBLING = 'sibling',
  ADULT = 'adult'
}

// Common interfaces used across modules
export interface RaceResult {
  carId: number;
  totalScore: number;
}

export interface AdvancementResult {
  advancing: number[];  // car IDs that advance
  needsTiebreaker: boolean;
  tiedCarIds: number[];
}
