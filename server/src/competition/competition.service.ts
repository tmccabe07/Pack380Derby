import { Injectable } from '@nestjs/common';

@Injectable()
export class CompetitionService {
  private numLanes: number = 6; // Default total number of lanes
  private usableLanes: number[] = [1, 2, 3, 4, 5, 6]; // Default usable lanes

  // Total lanes methods
  getNumLanes(): number {
    return this.numLanes;
  }

  setNumLanes(lanes: number): number {
    if (lanes < 1 || lanes > 6) {
      throw new Error('Number of lanes must be between 1 and 6');
    }

    this.numLanes = lanes;

    // Adjust usable lanes if they exceed the new total
    this.usableLanes = this.usableLanes.filter(lane => lane <= lanes);
    
    // If no usable lanes remain, default to all lanes being usable
    if (this.usableLanes.length === 0) {
      this.usableLanes = Array.from({ length: lanes }, (_, i) => i + 1);
    }

    return this.numLanes;
  }

  updateNumLanes(lanes: number): number {
    return this.setNumLanes(lanes);
  }

  // Usable lanes methods
  getUsableLanes(): number[] {
    return this.usableLanes;
  }

  getUsableLaneCount(): number {
    return this.usableLanes.length;
  }

  setUsableLanes(usableLanes: number[]): number[] {
    this.validateUsableLanes(usableLanes, this.numLanes);
    this.usableLanes = [...usableLanes].sort((a, b) => a - b);
    return this.usableLanes;
  }

  updateUsableLanes(usableLanes: number[]): number[] {
    return this.setUsableLanes(usableLanes);
  }

  // Combined methods (for backward compatibility)
  setLaneConfiguration(lanes: number, usableLanes?: number[]): { numLanes: number; usableLanes: number[] } {
    this.setNumLanes(lanes);
    
    if (usableLanes) {
      this.setUsableLanes(usableLanes);
    }

    return { numLanes: this.numLanes, usableLanes: this.usableLanes };
  }

  getLaneConfiguration(): { numLanes: number; usableLanes: number[]; usableLaneCount: number } {
    return {
      numLanes: this.numLanes,
      usableLanes: this.usableLanes,
      usableLaneCount: this.usableLanes.length
    };
  }

  private validateUsableLanes(usableLanes: number[], totalLanes: number): void {
    if (usableLanes.length === 0) {
      throw new Error('At least one lane must be usable');
    }

    if (usableLanes.length > totalLanes) {
      throw new Error('Cannot have more usable lanes than total lanes');
    }

    const uniqueLanes = new Set(usableLanes);
    if (uniqueLanes.size !== usableLanes.length) {
      throw new Error('Duplicate lane numbers are not allowed');
    }
  }
}
