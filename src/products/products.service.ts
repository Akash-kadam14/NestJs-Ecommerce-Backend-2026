import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    addProduct() {
        return "Product Added Successfully"
    }
}
