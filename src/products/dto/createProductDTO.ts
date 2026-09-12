import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator"
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDTO {
    @ApiProperty({ example: 'Wireless Mouse', description: 'Name of the product' })
    @IsString()
    name: string

    @ApiProperty({ example: 1, description: 'Category ID of the product' })
    @IsNumber()
    categoryId: number

    @ApiProperty({ example: 299.99, description: 'Price of the product' })
    @IsNumber()
    price: number

    @ApiPropertyOptional({ example: 'A wireless mouse with ergonomic design', description: 'Description of the product' })
    @IsString()
    @IsOptional()
    description?: string

    @ApiPropertyOptional({ example: 'https://example.com/mouse.jpg', description: 'Image URL of the product' })
    @IsString()
    @IsOptional()
    imageUrl?: string

    @ApiProperty({ example: 100, description: 'Stock quantity of the product' })
    @IsNumber()
    stock: number
}

// Reusing CreateProductDTO here:
export class BulkCreateProductsDTO {
    @ApiProperty({ type: [CreateProductDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductDTO)
    products: CreateProductDTO[];
}