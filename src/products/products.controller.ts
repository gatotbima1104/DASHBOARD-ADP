import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterProductDto } from './dto/filter.product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService
  ){}

  @Get()
  filterProducts(@Query() dto: FilterProductDto) {
    if (dto.category && dto.title) {
      return this.productsService.filterProduct(dto);
    } else {
      return this.productsService.getProducts();
  }
}

}

