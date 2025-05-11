import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateClientDto } from './dto/create-client.dto'
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserRolesDto } from './dto/update-user-role-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error creating user');
    }
  }

  async createClient(createClientDto: CreateClientDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createClientDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const { password, ...userData } = createClientDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        roles: ['client']
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.log(error);
      throw new Error('Error creating client');
     
    }
  }
  

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user: User | null = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password', 'isActive'],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user_id: user.id,
      name: user.name,
      email: user.email,
      token: this.jwtService.sign({ user_id: user.id }),
    };
  }

  async findAll(isActive?: boolean): Promise<User[]> {
    const where = isActive !== undefined ? { isActive } : {};
    const users = await this.userRepository.find({ where });
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    user.isActive = false;
    await this.userRepository.save(user);
    return user;
  }

  async activate(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    user.isActive = true;
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    await this.userRepository.delete(id);
    return user;
  }

  async updateUserRoles(
    id: string,
    updateUserRolesDto: UpdateUserRolesDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    user.roles = updateUserRolesDto.roles;

    return await this.userRepository.save(user);
  }
}
