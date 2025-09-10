import { RaceStage } from '../../common/types/race.types';

export interface RaceConfiguration {
  lanesPerHeat: number;
  heatMultiplier: number;
  stageName: string;
  nextStage: RaceStage | null;
  deadheatStage: RaceStage | null;
}

export interface RaceAdvancementRules {
  advancingCount: number;
  nextStage: RaceStage | null;
  deadheatStage: RaceStage | null;
}
