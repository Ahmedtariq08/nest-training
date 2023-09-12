import { Injectable } from '@nestjs/common';

export interface ILocationListDto {
  locations: string[]
}

@Injectable()
export class LocationService {
  listLocations(): ILocationListDto {
    return {
      locations: [
        'location 1',
        'location 2',
        'location 3',
      ]
    };
  }
}
