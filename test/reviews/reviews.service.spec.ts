import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewService } from '../../src/reviews/reviews.service';
import { Review } from '../../src/entities/review.entity';
import { NotFoundException } from '@nestjs/common';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: Repository<Review>;

  const mockReview = {
    id: '1',
    content: 'Test Review',
    rating: 5,
    isApproved: true,
    user: { id: '1', name: 'Test User' },
    candle: { id: '1', name: 'Test Candle' }
  };

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(review => Promise.resolve({ id: '1', ...review })),
    find: jest.fn().mockImplementation(({ where }) => {
      if (where?.isApproved !== undefined) {
        return Promise.resolve([{ ...mockReview, isApproved: where.isApproved }]);
      }
      return Promise.resolve([mockReview]);
    }),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => 
      id === '1' ? Promise.resolve(mockReview) : Promise.resolve(null)
    ),
    update: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
    delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    repository = module.get<Repository<Review>>(getRepositoryToken(Review));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const createReviewDto = {
        content: 'Test Review',
        rating: 5,
        isApproved: true,
        userId: '1',
        candleId: '1'
      };

      const result = await service.create(createReviewDto);
      expect(result).toEqual({
        id: '1',
        ...createReviewDto,
      });
      expect(repository.create).toHaveBeenCalledWith(createReviewDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all reviews when no filter is provided', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockReview]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single review', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockReview);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when review not found', async () => {
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateReviewDto = { content: 'Updated Review' };
      const result = await service.update('1', updateReviewDto);
      expect(result).toEqual(mockReview);
      expect(repository.update).toHaveBeenCalledWith('1', updateReviewDto);
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      await service.remove('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when removing non-existent review', async () => {
      mockRepository.delete.mockResolvedValueOnce({ affected: 0 });
      await expect(service.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
}); 