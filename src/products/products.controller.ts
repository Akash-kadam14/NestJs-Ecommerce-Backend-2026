import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UserRoles } from '../auth/enum/roles.enum';
import { Roles } from '../auth/customDecorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('add-product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addProduct() {
    return this.productsService.addProduct();
  }
}
