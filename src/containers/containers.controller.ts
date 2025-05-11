import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ContainersService } from './containers.service';
import { Container } from '../entities/container.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Containers')
@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new container' })
  @ApiResponse({ status: 201, description: 'Container created successfully', type: Container })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async create(
    @Body() createContainerDto: Partial<Container>,
  ): Promise<Container> {
    return this.containersService.create(createContainerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all containers' })
  @ApiResponse({ status: 200, description: 'Return all containers', type: [Container] })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findAll(): Promise<Container[]> {
    return this.containersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a container by id' })
  @ApiResponse({ status: 200, description: 'Return the container', type: Container })
  @ApiResponse({ status: 404, description: 'Container not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async findOne(@Param('id') id: string): Promise<Container> {
    return this.containersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a container' })
  @ApiResponse({ status: 200, description: 'Container updated successfully', type: Container })
  @ApiResponse({ status: 404, description: 'Container not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async update(
    @Param('id') id: string,
    @Body() updateContainerDto: Partial<Container>,
  ): Promise<Container> {
    return this.containersService.update(id, updateContainerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a container' })
  @ApiResponse({ status: 200, description: 'Container deleted successfully' })
  @ApiResponse({ status: 404, description: 'Container not found' })
  @Auth(ValidRoles.admin, ValidRoles.manager)
  async remove(@Param('id') id: string): Promise<void> {
    return this.containersService.remove(id);
  }
}
