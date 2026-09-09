import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/customDecorator/roles.decorator';
import { UserRoles } from 'src/auth/enum/roles.enum';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) { }

  @Post('addCategory')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN)
  async addCategory(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.addCategory(createProductCategoryDto);
  }

  @Get('getAllCategories')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  async getAllCategories() {
    return this.productCategoryService.getAllCategories();
  }

  @Get('getCategoryById/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  getCategoryById(@Param('id') id: string) {
    return this.productCategoryService.getCategoryById(+id);
  }

  @Patch('updateCategory/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN)
  updateCategory(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(+id, updateProductCategoryDto);
  }

  @Patch('inActiveCategoryStatus/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN)
  inActiveCategory(@Param('id') id: string) {
    return this.productCategoryService.inActiveCategory(+id);
  }
  @Patch('activateCategoryStatus/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN)
  activateCategoryStatus(@Param('id') id: string) {
    return this.productCategoryService.activateCategoryStatus(+id);
  }
}
