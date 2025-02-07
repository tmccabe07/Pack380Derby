import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    den: string;

    @IsString()
    @IsNotEmpty()
    rank: string;
}
