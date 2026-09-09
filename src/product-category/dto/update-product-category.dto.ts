import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductCategoryDto } from './create-product-category.dto';

export class UpdateProductCategoryDto extends PartialType(OmitType(CreateProductCategoryDto, ['isActive'] as const)) { }
