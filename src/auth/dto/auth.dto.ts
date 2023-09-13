import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Password can not be empty' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must not be less than 6 characters' })
    @IsAlphanumeric("en-US", { message: 'Password can only contain letters and numbers' })
    password: string
}