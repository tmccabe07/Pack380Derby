import { ApiProperty } from '@nestjs/swagger';
import { HeatLane } from '../../heat-lane/entities/heat-lane.entity'

export class Race {
    id: number;

    raceName: String;
  
    raceType: number;
    
    role: String;
  
    numLanes: number; 
  
    lane?: HeatLane[]
    
}
