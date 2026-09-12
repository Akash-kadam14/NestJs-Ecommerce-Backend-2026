import { IsString, IsNumber, IsOptional } from "class-validator"
export class CreateProductDTO {
    @IsString()
    name: string

    @IsNumber()
    categoryId: number

    @IsNumber()
    price: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    imageUrl?: string

    @IsNumber()
    stock: number
}