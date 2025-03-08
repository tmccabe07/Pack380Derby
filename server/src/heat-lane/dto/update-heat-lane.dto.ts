import { PartialType } from '@nestjs/swagger';
import { CreateHeatLaneDto } from './create-heat-lane.dto';

export class UpdateHeatLaneDto extends PartialType(CreateHeatLaneDto) {}
