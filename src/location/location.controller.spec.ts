import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('Location Controller', () => {
  let appController: LocationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService],
    }).compile();

    appController = app.get<LocationController>(LocationController);
  });

  describe('root', () => {
    it('should return locations list', () => {
      expect(appController.listLocations()).toMatchObject({
        locations: [
          'location 1',
          'location 2',
          'location 3',
        ]
      });
    });
  });
});
