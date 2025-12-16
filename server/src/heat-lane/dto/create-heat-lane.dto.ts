import { IsNotEmpty, IsInt, IsIn, IsString, IsOptional } from 'class-validator';
import { Car, Race } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';

export class CreateHeatLaneDto {
    @ApiProperty({
        example: 1,
        description: 'The lane of the car',
        required: true,
    })
    @IsInt()
    @IsNotEmpty()
    @IsIn([1,2,3,4,5,6,0], { message: 'lane must be one of: 1,2,3,4,5,6'})
    lane: number;
    
    @ApiProperty({
        example: 1,
        description: 'The result of the car in the heat, valid values are 1,2,3,4,5,6 or 0 for default',
        required: false,
        nullable: true
    })
    @IsInt()
    @IsIn([1,2,3,4,5,6,0], { message: 'result must be one of: 1,2,3,4,5,6,0'})
    @IsOptional()
    result: number;
    
    @ApiProperty({
        example: 1,
        description: 'The ID of the car',
        required: true,
    })
    @IsInt()
    @IsNotEmpty()
    carId: Car["id"];

    @ApiProperty({
        example: 1,
        description: 'The heat id of the race',
        required: true,
    })
    @IsInt()
    @IsNotEmpty()
    heatId: number;

    @ApiProperty({
        example: 1,
        description: 'The ID of the race, matches race table',
        required: true,
    })
    @IsInt()
    @IsNotEmpty()
    raceId: Race["id"];

    @ApiProperty({
        example: 10,
        description: 'The type of the race, valid values are 10 for prelim, 20 for semifinals, 30 for final, 40 for preliminary deadheat, 50 for semifinal deadheat',
        required: true,
    })
    @IsInt()
    @IsIn([10,20,30,40,50], { message: 'raceType must be one of: 10,20,30,40,50'})
    @IsNotEmpty()
    raceType: number;

    @ApiProperty({
        example: 'cub',
        description: 'The type of the racer, valid values are cub, sibling, adult',
        required: true,
    })
    @IsString()
    @IsIn(['cub', 'sibling', 'adult'], { message: 'racerType must be one of: cub, sibling, adult'})
    @IsNotEmpty()
    racerType: string;
}
