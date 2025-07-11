import { ApiProperty } from '@nestjs/swagger';

export class Racer {
  @ApiProperty({
      example: '1',
      description: 'The unique id of the racer',
  })
  id: number;

  @ApiProperty({
      example: 'Jane Doe',
      description: 'The name of the racer',
  })
  name: string;

  @ApiProperty({
      example: 'Den 8',
      description: 'The den number, valid values are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11',
  })
  den: string;

  @ApiProperty({
    example: 'Lion',
    description: 'The rank, valid values are lion, tiger, wolf, bear, webelos, aol, sibling, adult',
  })
  rank: string;

}
