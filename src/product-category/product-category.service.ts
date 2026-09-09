import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) { }
  async addCategory(createProductCategoryDto: CreateProductCategoryDto) {
    const isCategoryExist = await this.prisma.category.findUnique({
      where: { slug: createProductCategoryDto.slug }
    })
    if (isCategoryExist) {
      throw new ConflictException('Category already exists')
    }
    const createCategory = await this.prisma.category.create({
      data: createProductCategoryDto,
    })

    return { message: 'Category created successfully', data: createCategory };
  }

  async getAllCategories() {
    const allCategories = await this.prisma.category.findMany();
    return allCategories;
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, isActive: true }
    })
    if (!category) {
      throw new ConflictException('Category not found')
    }
    return category;
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    const isCategoryExist = await this.prisma.category.findUnique({
      where: { id, isActive: true }
    });

    if (!isCategoryExist) {
      throw new NotFoundException('Category not found')
    }

    // if slug is being updated, check for conflicts
    if (updateProductCategoryDto.slug && isCategoryExist.slug !== updateProductCategoryDto.slug) {
      const isSlugExist = await this.prisma.category.findUnique({
        where: { slug: updateProductCategoryDto.slug }
      })
      if (isSlugExist) {
        throw new ConflictException('Category slug already exists')
      }
    }

    await this.prisma.category.update({
      where: { id },
      data: updateProductCategoryDto
    })

    return { message: 'Category updated successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
