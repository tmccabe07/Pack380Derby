import { Injectable } from '@nestjs/common';

@Injectable()
export class RaceGlobalVariableService {
  private numAdvances: number  = 0;

  private advance = [
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

  getAdvance() {
    return this.advance;
  }

  setAdvance(data){    
    this.advance = data;
  }

  initAdvance(){
    this.advance.length = 0;
  }

  getRaceName(value: number): string {
    switch(value){
      case 1:
        return "quarterfinal";
      case 2: 
        return "semi";
      case 3: 
        return "final";
      case 4: 
        return "quarterfinaldeadheat";
      case 5:
        return "semideadheat";
      default:
        return "racetype match not found";
    }
    
  }

}