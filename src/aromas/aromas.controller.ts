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
import { AromasService } from './aromas.service';
import { Aroma } from '../entities/aroma.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Aromas')
@Controller('aromas')
export class AromasController {
  constructor(private readonly aromasService: AromasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new aroma' })
  @ApiResponse({ status: 201, description: 'Aroma created successfully', type: Aroma })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async create(@Body() createAromaDto: Partial<Aroma>): Promise<Aroma> {
    return this.aromasService.create(createAromaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all aromas' })
  @ApiResponse({ status: 200, description: 'Return all aromas', type: [Aroma] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findAll(): Promise<Aroma[]> {
    return this.aromasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an aroma by id' })
  @ApiResponse({ status: 200, description: 'Return the aroma', type: Aroma })
  @ApiResponse({ status: 404, description: 'Aroma not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findOne(@Param('id') id: string): Promise<Aroma> {
    return this.aromasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an aroma' })
  @ApiResponse({ status: 200, description: 'Aroma updated successfully', type: Aroma })
  @ApiResponse({ status: 404, description: 'Aroma not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async update(
    @Param('id') id: string,
    @Body() updateAromaDto: Partial<Aroma>,
  ): Promise<Aroma> {
    return this.aromasService.update(id, updateAromaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an aroma' })
  @ApiResponse({ status: 200, description: 'Aroma deleted successfully' })
  @ApiResponse({ status: 404, description: 'Aroma not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async remove(@Param('id') id: string): Promise<void> {
    return this.aromasService.remove(id);
  }

  // Assign an IntendedImpact to an Aroma
  @Patch(':id/assign-intended-impact/:intendedImpactId')
  @ApiOperation({ summary: 'Assign an intended impact to an aroma' })
  @ApiResponse({ status: 200, description: 'Intended impact assigned successfully', type: Aroma })
  @ApiResponse({ status: 404, description: 'Aroma or intended impact not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async assignIntendedImpact(
    @Param('id', new ParseUUIDPipe()) aromaId: string,
    @Param('intendedImpactId', new ParseUUIDPipe()) intendedImpactId: string,
  ): Promise<Aroma> {
    return this.aromasService.assignIntendedImpact(aromaId, intendedImpactId);
  }
}
