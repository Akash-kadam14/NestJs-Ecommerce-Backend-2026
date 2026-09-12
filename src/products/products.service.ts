import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProductDTO } from './dto/createProductDTO';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async addProduct(products: CreateProductDTO[]) {
        try {
            await this.prisma.product.createMany({
                data: products
            })
            return { message: "Product Added Successfully" }
        } catch (error) {
            if (error) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Product already exists');
                }
            }
            throw error;
        }
    }
}
