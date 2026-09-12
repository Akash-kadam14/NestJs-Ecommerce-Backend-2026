import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UserRoles } from '../auth/enum/roles.enum';
import { Roles } from '../auth/customDecorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BulkCreateProductsDTO } from './dto/createProductDTO'
import { Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('add-product')
  @ApiOperation({ summary: 'Add multiple products (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product Added Successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async addProduct(@Body() bulkDto: BulkCreateProductsDTO) {
    return this.productsService.addProduct(bulkDto.products);
  }
}
