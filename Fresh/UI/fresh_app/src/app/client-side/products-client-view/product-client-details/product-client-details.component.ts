import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductPriceService } from '../../../services/product-price.service';
import { Products } from '../../../model/Products';
import { ProductPrice } from '../../../model/ProductPrice';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ProductPriceSearch } from '../../../model/search/ProductPriceSearch';
import { PagedResult } from '../../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-client-details',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatProgressSpinnerModule, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './product-client-details.component.html',
  styleUrl: './product-client-details.component.css'
})
export class ProductClientDetailsComponent {
  product: Products;
  productPrices: any[] = [];
  loading: boolean = true;
  pagedResult: PagedResult<ProductPrice> | null = null;
  search: ProductPriceSearch = {
    page: undefined,
    pageSize: undefined,
    date: undefined
  };

  constructor(private router: Router, private productPriceService: ProductPriceService) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'];
  }

  ngOnInit(): void {
    this.getProductPrice();
  }

  getProductPrice() {
    this.productPriceService.getByProductId('GetByProductId', this.product.id, this.search)
      .subscribe(data => {
        this.pagedResult = data;
        this.productPrices = this.groupPriceByDate(data.items);
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent) {
    this.search.page = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getProductPrice();
  }

  groupPriceByDate(prices: ProductPrice[]): { date: string, prices: ProductPrice[] }[] {
    const grouped: { [key: string]: ProductPrice[] } = {};

    prices.forEach(p => {
      const date = new Date(p.effectiveFrom).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(p);
    });

    return Object.keys(grouped).map(date => ({
      date,
      prices: grouped[date]
    }));
  }

  Search() {
    this.getProductPrice();
  }

  ResetFilter() {
    this.search = {
      date: undefined
    }

    this.getProductPrice();
  }

  cancel() {
    this.router.navigate(['/main-page/products-list']);
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

}
