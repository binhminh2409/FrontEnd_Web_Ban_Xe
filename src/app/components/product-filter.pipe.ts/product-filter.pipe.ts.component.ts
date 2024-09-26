import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../../models/Produts';

@Pipe({
  name: 'priceRange'
})
export class PriceRangePipe implements PipeTransform {
  transform(products: Products[], searchText: string, minPrice: number, maxPrice: number): Products[] {
    if (!products || (!searchText && (minPrice === null || maxPrice === null))) {
      return products;
    }

    let filteredProducts = products;

    // Lọc theo tên hoặc mô tả nếu có searchText
    if (searchText) {
      searchText = searchText.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.productName.toLowerCase().includes(searchText) ||
        product.price.toString().includes(searchText)
      );
    }

    // Lọc theo giá nếu có minPrice và maxPrice
    if (minPrice !== null && maxPrice !== null) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
      );
    }

    return filteredProducts;
  }
}
