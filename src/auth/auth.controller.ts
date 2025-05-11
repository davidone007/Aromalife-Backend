import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entity/user.entity';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.admin)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('register-client')
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({ status: 201, description: 'Client successfully registered', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.authService.createClient(createClientDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @Auth(ValidRoles.admin, ValidRoles.manager, ValidRoles.client)
  async logout(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Logout successful',
      user,
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @Auth(ValidRoles.admin)
  async findAll(@Query('isActive') isActive?: boolean) {
    return this.authService.findAll(isActive);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: string) {
    return this.authService.deactivate(id);
  }

  @Put('users/:id/activate')
  @ApiOperation({ summary: 'Activate a user' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async activate(@Param('id') id: string) {
    return this.authService.activate(id);
  }

  @Delete('users/:id/remove')
  @ApiOperation({ summary: 'Remove a user' })
  @ApiResponse({ status: 200, description: 'User removed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async removeUser(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Put('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async deactivate(@Param('id') id: string) {
    return this.authService.deactivate(id);
  }

  @Put('users/:id/roles')
  @ApiOperation({ summary: 'Update user roles' })
  @ApiResponse({ status: 200, description: 'User roles updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth(ValidRoles.admin)
  async updateUserRoles(
    @Param('id') id: string,
    @Body() updateUserRolesDto: { roles: ValidRoles[] },
  ) {
    return this.authService.updateUserRoles(id, updateUserRolesDto);
  }
}
