import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/local/signup')
    signupLocal(@Body() dto: AuthDto) {
        this.authService.signUpLocal(dto);
    }

    @Post('/local/signin')
    signInLocal() {
        this.authService.signInLocal();
    }

    @Post('/logout')
    logout() {
        this.authService.logout();
    }

    @Post('/refresh')
    refreshToken() {
        this.authService.refreshToken();
    }

}
