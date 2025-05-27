import { IsInt } from 'class-validator';

export class CreateResultDto {
    @IsInt()
    carId: number;

    @IsInt()
    raceType: number;
}
