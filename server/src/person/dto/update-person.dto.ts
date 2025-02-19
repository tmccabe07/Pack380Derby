import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
    id: number;
    name: string;
    den: string;
    rank: string;
    role: string;
}
