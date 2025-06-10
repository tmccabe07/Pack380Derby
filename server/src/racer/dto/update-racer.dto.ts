import { PartialType } from '@nestjs/mapped-types';
import { CreateRacerDto } from './create-racer.dto';

export class UpdateRacerDto extends PartialType(CreateRacerDto) {
    id: number;
    name: string;
    den: string;
    rank: string;
}
