import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@db/entities/user.entity';
import { Role } from '@models/role.model';
import { generateImage } from '@utils/generate-img';
import { CreateUserDto, UpdateUserDto } from '@dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findUserById(id: User['id']) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  getAll() {
    return this.usersRepo.find();
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneByOrFail({ email });
  }

  async create(dto: CreateUserDto) {
    const user = this.usersRepo.create(dto);
    user.role = Role.ADMIN;
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
    user.avatar = generateImage('face');
    return this.usersRepo.save(user);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findUserById(id);
    this.usersRepo.merge(user, changes);
    return this.usersRepo.save(user);
  }

  async delete(id: number) {
    const user = await this.findUserById(id);
    return this.usersRepo.remove(user);
  }
}
