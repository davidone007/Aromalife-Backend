import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandlesService } from '../../src/candles/candles.service';
import { Candle } from '../../src/entities/candle.entity';
import { Container } from '../../src/entities/container.entity';
import { Aroma } from '../../src/entities/aroma.entity';
import { Gift } from '../../src/entities/gift.entity';

describe('CandlesService', () => {
  let service: CandlesService;
  let candleRepository: Repository<Candle>;
  let containerRepository: Repository<Container>;
  let aromaRepository: Repository<Aroma>;
  let giftRepository: Repository<Gift>;

  const mockCandle = {
    id: '1',
    name: 'Test Candle',
    description: 'Test Description',
    price: 50,
    isActive: true,
    container: { id: '1', name: 'Test Container' },
    aroma: { id: '1', name: 'Test Aroma' },
    gift: { id: '1', name: 'Test Gift' }
  };

  const mockRepositories = {
    candle: {
      create: jest.fn().mockImplementation(dto => dto),
      save: jest.fn().mockImplementation(candle => Promise.resolve({ id: '1', ...candle })),
      find: jest.fn().mockImplementation(() => Promise.resolve([mockCandle])),
      findOne: jest.fn().mockImplementation(({ where: { id } }) => 
        id === '1' ? Promise.resolve(mockCandle) : Promise.resolve(null)
      ),
      update: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
      delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
    },
    container: {
      find: jest.fn().mockImplementation(() => Promise.resolve([{ id: '1', name: 'Test Container' }])),
    },
    aroma: {
      findOne: jest.fn().mockImplementation(() => Promise.resolve({ id: '1', name: 'Test Aroma' })),
    },
    gift: {
      find: jest.fn().mockImplementation(() => Promise.resolve([{ id: '1', name: 'Test Gift' }])),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandlesService,
        {
          provide: getRepositoryToken(Candle),
          useValue: mockRepositories.candle,
        },
        {
          provide: getRepositoryToken(Container),
          useValue: mockRepositories.container,
        },
        {
          provide: getRepositoryToken(Aroma),
          useValue: mockRepositories.aroma,
        },
        {
          provide: getRepositoryToken(Gift),
          useValue: mockRepositories.gift,
        },
      ],
    }).compile();

    service = module.get<CandlesService>(CandlesService);
    candleRepository = module.get<Repository<Candle>>(getRepositoryToken(Candle));
    containerRepository = module.get<Repository<Container>>(getRepositoryToken(Container));
    aromaRepository = module.get<Repository<Aroma>>(getRepositoryToken(Aroma));
    giftRepository = module.get<Repository<Gift>>(getRepositoryToken(Gift));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCandle', () => {
    it('should create a new candle', async () => {
      const createCandleDto = {
        name: 'Test Candle',
        description: 'Test Description',
        price: 50,
        containerId: '1',
        aromaId: '1',
        giftId: '1',
        isActive: true
      };

      const result = await service.createCandle(createCandleDto);
      expect(result).toEqual({
        id: '1',
        ...createCandleDto,
      });
      expect(candleRepository.create).toHaveBeenCalledWith(createCandleDto);
      expect(candleRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of candles', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCandle]);
      expect(candleRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single candle', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCandle);
      expect(candleRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw error when candle not found', async () => {
      await expect(service.findOne('2')).rejects.toThrow('Candle not found');
    });
  });

  describe('update', () => {
    it('should update a candle', async () => {
      const updateCandleDto = { name: 'Updated Candle' };
      const result = await service.update('1', updateCandleDto);
      expect(result).toEqual(mockCandle);
      expect(candleRepository.update).toHaveBeenCalledWith('1', updateCandleDto);
    });
  });

  describe('remove', () => {
    it('should remove a candle', async () => {
      await service.remove('1');
      expect(candleRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getContainers', () => {
    it('should return an array of containers', async () => {
      const result = await service.getContainers();
      expect(result).toEqual([{ id: '1', name: 'Test Container' }]);
      expect(containerRepository.find).toHaveBeenCalled();
    });
  });

  describe('getGifts', () => {
    it('should return an array of gifts', async () => {
      const result = await service.getGifts();
      expect(result).toEqual([{ id: '1', name: 'Test Gift' }]);
      expect(giftRepository.find).toHaveBeenCalled();
    });
  });
}); 