import { Controller, Get, Post, Put, Body } from '@nestjs/common';

// Simple in-memory config for demonstration
let configuration = {
  numLanes: 6,
  usableLanes: [1, 2, 3, 4, 5, 6],
  votingCategories: ["Most Creative", "Best Paint Job", "Fastest Car"],
};

@Controller('api/competition')
export class CompetitionConfigurationController {
  @Get('configuration')
  getConfig() {
    return configuration;
  }

  @Post('configuration')
  setConfig(@Body() body: any) {
    configuration = { ...configuration, ...body };
    return configuration;
  }

  @Put('configuration')
  updateConfig(@Body() body: any) {
    configuration = { ...configuration, ...body };
    return configuration;
  }
}
