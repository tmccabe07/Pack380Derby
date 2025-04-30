import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    den: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['lion','tiger','wolf','bear','webelos','aol', 'sibling', 'adult'], { message: 'rank must be one of: lion, tiger, wolf, bear, webelos, aol, sibling, adult'})
    rank: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['cub','sibling','adult'], { message: 'role must be one of: cub, sibling, adult'})
    role: string;
}
