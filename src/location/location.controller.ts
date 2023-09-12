import { Controller, Get, Render } from '@nestjs/common';
import { LocationService, ILocationListDto } from './location.service';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Get('locations')
  @Render('list.hbs')
  listLocations(): ILocationListDto {
    return this.locationService.listLocations();
  }
}
