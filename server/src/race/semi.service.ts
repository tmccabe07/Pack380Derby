import { Injectable } from '@nestjs/common';

@Injectable()
export class SemiGlobalVariableService {
  private numAdvances: number  = 0;

  private advanceToSemis = [
    { 
      carId: 0,
      aggResults: 0, 
    },
  ];

  getNumAdvances(): number {
    return this.numAdvances;
  }

  setnumAdvances(value: number): void {
    this.numAdvances = value;
  }

  getAdvanceToSemis() {
    return this.advanceToSemis;
  }

  setAdvanceToSemis(data){    
    this.advanceToSemis = data;
  }

  initAdvanceToSemis(){
    this.advanceToSemis.length = 0;
  }
}