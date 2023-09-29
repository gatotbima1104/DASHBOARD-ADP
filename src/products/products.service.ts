import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { FilterProductDto } from './dto/filter.product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ){}

  // async filterProduct (){
  //   const products = this.productRepo.createQueryBuilder('product')
  //     .select('product')
  //     .where('product.category = :category', {category: "electronics"})
  //     // .andWhere('product.title LIKE :title', {title: "Acer"})
  //     // .getMany()
  //     .getMany()

  //   // if(!products){
  //   //   throw new HttpException({
  //   //     statusCode: 404,
  //   //     message: 'Category not found',
  //   //   },
  //   //   HttpStatus.NOT_FOUND
  //   //   )
  //   // }
  //   return products
  // }


  async filterProduct(dto: FilterProductDto) {
    const queryBuilder = this.productRepo.createQueryBuilder('product')
      .select('product')
      .where('product.category = :category', { category: dto.category }) // Filter by dynamic category
      .andWhere('product.title LIKE :title', { title: `%${dto.title}%` }); // Filter by title containing specified keyword
  
    const products = await queryBuilder.getRawMany();
  
    if (!products || products.length === 0) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'Products not found',
        },
        HttpStatus.NOT_FOUND
      );
    }
  
    return products;
  }
  


  

  async getProducts(){
    return this.productRepo.find()
  }

}
