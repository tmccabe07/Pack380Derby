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
    @IsIn(['Lion','Tiger','Wolf','Bear','Webelos','AoL'], { message: 'rank must be one of: Lion, Tiger, Wolf, Bear, Webelos, AoL'})
    rank: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['Cub','Sibling','Adult'], { message: 'role must be one of: Cub, Sibling, Adult'})
    role: string;
}
