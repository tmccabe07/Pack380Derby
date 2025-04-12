import { Injectable } from '@nestjs/common';

@Injectable()
export class SemiGlobalVariableService {
  private numAdvances: number  = 0;

  getNumAdvances(): number {
    return this.numAdvances;
  }

  setnumAdvances(value: number): void {
    this.numAdvances = value;
  }
}