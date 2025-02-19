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
    description: 'The den number, valid values are Den 1, Den 2, Den 3, Den 4, Den 5, Den 6, Den 7, Den 8, Den 10, Den 11, Sibling, Adult',
})
den: string;

@ApiProperty({
  example: 'Lion',
  description: 'The rank, valid values are Lion, Tiger, Wolf, Bear, Webelos, AoL, Sibling, Adult',
})
rank: string;

@ApiProperty({
    example: 'Cub',
    description: 'The role, valid values are Cub, Sibling, Adult',
  })
  role: string;

}
