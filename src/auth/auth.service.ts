import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // generate password hash
      const hash = await argon.hash(dto.password);

      // save user to db

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;

      // return saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      } else throw error;
    }
  }

  signin() {
    return 'i am signed up';
  }
}
