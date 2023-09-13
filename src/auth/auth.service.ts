import { BadRequestException, Body, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

const atExpireTime = 60 * 15;   //15 minutes
const rtExpireTime = 60 * 60 * 24 * 7; // 7 days

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }



    signUpLocal = async (dto: AuthDto): Promise<Tokens> => {
        const hash = await this.hashData(dto.password);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash
            }
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    signInLocal = async (dto: AuthDto): Promise<Tokens> => {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new NotFoundException('User not found with provided credentials');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if (!passwordMatches) {
            throw new BadRequestException('Incorrect password provided');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    logout = async (userId: number) => {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                },
            },
            data: {
                hashedRt: null
            }
        });
        return 'Logged out user successfully.'
    }

    refreshToken = async (userId: number, refreshToken: string): Promise<Tokens> => {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.hashedRt) {
            throw new ForbiddenException('Access denied');
        }

        const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);
        if (!rtMatches) {
            throw new BadRequestException('Tokens do not match');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    //ANCHOR - Utility functions
    private hashData = async (data: string) => {
        return bcrypt.hash(data, 10);
    }

    private getTokens = async (userId: number, email: string): Promise<Tokens> => {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'at-secret',
                expiresIn: atExpireTime
            }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'rt-secret',
                expiresIn: rtExpireTime
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    private updateRefreshTokenHash = async (userId: number, refreshToken: string) => {
        const hash = await this.hashData(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash
            }
        })
    }
}
