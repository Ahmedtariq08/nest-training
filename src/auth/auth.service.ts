import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    hashData = async (data: string) => {
        return bcrypt.hash(data, 10);
    }

    getTokens = async (userId: number, email: string) => {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, { secret=})
        ])
        const accessToken = this.jwtService.signAsync({
            sub: userId,
            email
        }, {
            expiresIn: 60 * 15
        })
    }

    signUpLocal = async (dto: AuthDto): Promise<Tokens> => {
        const hash = await this.hashData(dto.password);

        const newUser = this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash
            }
        })



    }

    signInLocal() {

    }

    logout() {

    }

    refreshToken() {

    }
}
