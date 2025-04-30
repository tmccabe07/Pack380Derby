import { ApiProperty } from '@nestjs/swagger';

export class Person {
@ApiProperty({
    example: '1',
    description: 'The unique id of the person',
})
id: number;


@ApiProperty({
    example: 'Jane Doe',
    description: 'The name of the person',
})
name: string;

@ApiProperty({
    example: 'Den 8',
    description: 'The den number, valid values are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, sibling, adult',
})
den: string;

@ApiProperty({
  example: 'Lion',
  description: 'The rank, valid values are lion, tiger, wolf, bear, webelos, aol, sibling, adult',
})
rank: string;

@ApiProperty({
    example: 'Cub',
    description: 'The role, valid values are cub, sibling, adult',
  })
  role: string;

}
