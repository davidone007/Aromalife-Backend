import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from '../../src/places/places.controller';
import { PlacesService } from '../../src/places/places.service';
import { Place } from '../../src/entities/place.entity';

const mockPlace: Place = {
  id: '1',
  name: 'Test Place',
  icon: 'icon.png',
  intendedImpacts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PlacesController', () => {
  let controller: PlacesController;
  let service: PlacesService;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPlace),
    findAll: jest.fn().mockResolvedValue([mockPlace]),
    findOne: jest.fn().mockResolvedValue(mockPlace),
    update: jest.fn().mockResolvedValue(mockPlace),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        { provide: PlacesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
    service = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a place', async () => {
    const dto = { name: 'Test Place', icon: 'icon.png' };
    const result = await controller.create(dto as any);
    expect(result).toEqual(mockPlace);
  });

  it('should return all places', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockPlace]);
  });

  it('should return one place', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockPlace);
  });

  it('should update a place', async () => {
    const result = await controller.update('1', { name: 'Updated' } as any);
    expect(result).toEqual(mockPlace);
  });

  it('should remove a place', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
  });
});
