import { IsNotEmpty, IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'firstName should not be empty' })
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'first Name should contain only alphabets' })
    firstName: string;

    @IsNotEmpty({ message: 'lastName should not be empty' })
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'last Name should contain only alphabets' })
    lastName: string;

    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail()
    email: string;

    @IsNotEmpty({ message: 'password should not be empty' })
    @MinLength(6, { message: 'password should be at least 6 characters long' })
    @IsString()
    password: string;

    @IsNotEmpty({ message: 'mobileNumber should not be empty' })
    @IsString()
    @Matches(/^(\+91-|\+91)[0-9]{10}$/, { message: 'mobileNumber should be a valid Indian mobile number' })
    mobileNumber: string;

    @IsNotEmpty({ message: 'address should not be empty' })
    @IsString()
    address: string;
}