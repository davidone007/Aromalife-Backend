import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { CandlesService } from './candles.service';
import { Candle } from '../entities/candle.entity';
import { Container } from '../entities/container.entity';
import { Gift } from '../entities/gift.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Candles')
@Controller('candles')
export class CandlesController {
  constructor(private readonly candlesService: CandlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new candle' })
  @ApiResponse({ status: 201, description: 'Candle created successfully', type: Candle })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async create(@Body() createCandleDto: Partial<Candle>): Promise<Candle> {
    return this.candlesService.createCandle(createCandleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all candles' })
  @ApiResponse({ status: 200, description: 'Return all candles', type: [Candle] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findAll(): Promise<Candle[]> {
    return this.candlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a candle by id' })
  @ApiResponse({ status: 200, description: 'Return the candle', type: Candle })
  @ApiResponse({ status: 404, description: 'Candle not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findOne(@Param('id') id: string): Promise<Candle> {
    return this.candlesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a candle' })
  @ApiResponse({ status: 200, description: 'Candle updated successfully', type: Candle })
  @ApiResponse({ status: 404, description: 'Candle not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async update(
    @Param('id') id: string,
    @Body() updateCandleDto: Partial<Candle>,
  ): Promise<Candle> {
    return this.candlesService.update(id, updateCandleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a candle' })
  @ApiResponse({ status: 200, description: 'Candle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Candle not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async remove(@Param('id') id: string): Promise<void> {
    return this.candlesService.remove(id);
  }

  @Get('containers')
  @ApiOperation({ summary: 'Get all available containers' })
  @ApiResponse({ status: 200, description: 'Return all containers', type: [Container] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async getContainers(): Promise<Container[]> {
    return this.candlesService.getContainers();
  }

  @Get('gifts')
  @ApiOperation({ summary: 'Get all available gifts' })
  @ApiResponse({ status: 200, description: 'Return all gifts', type: [Gift] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async getGifts(): Promise<Gift[]> {
    return this.candlesService.getGifts();
  }

  @Patch(':candleId/assign-aroma/:aromaId')
  @ApiOperation({ summary: 'Assign an aroma to a candle' })
  @ApiResponse({ status: 200, description: 'Aroma assigned successfully', type: Candle })
  @ApiResponse({ status: 404, description: 'Candle or aroma not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async assignAroma(
    @Param('candleId') candleId: string,
    @Param('aromaId') aromaId: string,
  ): Promise<Candle> {
    return this.candlesService.assignAroma(candleId, aromaId);
  }

  @Patch(':candleId/assign-container/:containerId')
  @ApiOperation({ summary: 'Assign a container to a candle' })
  @ApiResponse({ status: 200, description: 'Container assigned successfully', type: Candle })
  @ApiResponse({ status: 404, description: 'Candle or container not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async assignContainer(
    @Param('candleId') candleId: string,
    @Param('containerId') containerId: string,
  ): Promise<Candle> {
    return this.candlesService.assignContainer(candleId, containerId);
  }
}
