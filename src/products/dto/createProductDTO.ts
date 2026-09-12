import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator"
import { Type } from 'class-transformer';
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

// Reusing CreateProductDTO here:
export class BulkCreateProductsDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductDTO)
    products: CreateProductDTO[];
}