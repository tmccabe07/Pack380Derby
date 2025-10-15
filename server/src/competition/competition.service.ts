import { Injectable } from '@nestjs/common';

@Injectable()
export class CompetitionService {
  private numLanes: number = 4; // Default number of lanes

  getNumLanes(): number {
    return this.numLanes;
  }

  setNumLanes(lanes: number): number {
    if (lanes < 1 || lanes > 6) {
      throw new Error('Number of lanes must be between 1 and 6');
    }
    this.numLanes = lanes;
    return this.numLanes;
  }

  updateNumLanes(lanes: number): number {
    return this.setNumLanes(lanes);
  }
}
