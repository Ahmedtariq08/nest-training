import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequests: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false,
            secretOrKey: 'at-secret'
        });
    }

    validate = (payload: any) => {
        return payload;
    }
}