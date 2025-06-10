import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateRacerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    den: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['lion','tiger','wolf','bear','webelos','aol', 'sibling', 'adult'], { message: 'rank must be one of: lion, tiger, wolf, bear, webelos, aol, sibling, adult'})
    rank: string;
}
