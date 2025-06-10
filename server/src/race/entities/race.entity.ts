import { ApiProperty } from '@nestjs/swagger';
import { HeatLane } from '../../heat-lane/entities/heat-lane.entity'

export class Race {
    @ApiProperty({
        example: '1',
        description: 'The unique id of the race',
    })
    id: number;

    @ApiProperty({
        example: '1',
        description: 'The name of the race, can be quarterfinal, quarterfinaldeadheat, semi, semideadheat, final',
    })
    raceName: String;
  
    @ApiProperty({
        example: '1',
        description: 'The racetype, can be 1 for prelim to generate quarterfinal, 10 for quarterfinal, 20 for semi, 30 for final, 40 for quarterfinaldeadheat, 50 for semifinaldeadheat',
    })
    raceType: number;
    
    @ApiProperty({
        example: 'cub',
        description: 'The rank for the race, can be cub, sibling, adult',
    })
    rank: String;
  
    @ApiProperty({
        example: '6',
        description: 'The number of valid lanes',
    })
    numLanes: number; 
  
    lane?: HeatLane[]
    
}
