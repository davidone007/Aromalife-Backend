import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IntendedImpactService } from './intendedImpact.service';
import { IntendedImpact } from '../entities/intendedImpact.entity';
import { CreateIntendedImpactDto } from './dto/create-intended-impact.dto';
import { UpdateIntendedImpactDto } from './dto/update-intended-impact.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Intended Impacts')
@Controller('intended-impacts')
export class IntendedImpactController {
  constructor(private readonly intendedImpactService: IntendedImpactService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new intended impact' })
  @ApiResponse({ status: 201, description: 'Intended impact created successfully', type: IntendedImpact })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async create(@Body() dto: CreateIntendedImpactDto): Promise<IntendedImpact> {
    return this.intendedImpactService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all intended impacts' })
  @ApiResponse({ status: 200, description: 'Return all intended impacts', type: [IntendedImpact] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findAll(): Promise<IntendedImpact[]> {
    return this.intendedImpactService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an intended impact by id' })
  @ApiResponse({ status: 200, description: 'Return the intended impact', type: IntendedImpact })
  @ApiResponse({ status: 404, description: 'Intended impact not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IntendedImpact> {
    return this.intendedImpactService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an intended impact' })
  @ApiResponse({ status: 200, description: 'Intended impact updated successfully', type: IntendedImpact })
  @ApiResponse({ status: 404, description: 'Intended impact not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateIntendedImpactDto,
  ): Promise<IntendedImpact> {
    return this.intendedImpactService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an intended impact' })
  @ApiResponse({ status: 200, description: 'Intended impact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Intended impact not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.intendedImpactService.remove(id);
  }

  // Assign a MainOption to an IntendedImpact
  @Patch(':id/assign-main-option/:mainOptionId')
  @ApiOperation({ summary: 'Assign a MainOption to an IntendedImpact' })
  @ApiResponse({ status: 200, description: 'MainOption assigned successfully', type: IntendedImpact })
  @ApiResponse({ status: 404, description: 'Intended impact or MainOption not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async assignMainOption(
    @Param('id', new ParseUUIDPipe()) intendedImpactId: string,
    @Param('mainOptionId', new ParseUUIDPipe()) mainOptionId: string,
  ): Promise<IntendedImpact> {
    return this.intendedImpactService.assignMainOption(intendedImpactId, mainOptionId);
  }

  // Assign a Place to an IntendedImpact
  @Patch(':id/assign-place/:placeId')
  @ApiOperation({ summary: 'Assign a Place to an IntendedImpact' })
  @ApiResponse({ status: 200, description: 'Place assigned successfully', type: IntendedImpact })
  @ApiResponse({ status: 404, description: 'Intended impact or Place not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async assignPlace(
    @Param('id', new ParseUUIDPipe()) intendedImpactId: string,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ): Promise<IntendedImpact> {
    return this.intendedImpactService.assignPlace(intendedImpactId, placeId);
  }
}
