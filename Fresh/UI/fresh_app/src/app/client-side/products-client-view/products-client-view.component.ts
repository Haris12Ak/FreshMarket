import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Products } from '../../model/Products';
import { ProductService } from '../../services/product.service';
import { CompanyService } from '../../services/company.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../model/ProductType';
import { ProductSearch } from '../../model/search/ProductSearch';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from "@angular/material/tooltip";
import { Router } from '@angular/router';
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products-client-view',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner, MatCardModule, MatButtonModule, MatFormField, MatLabel, MatOption, MatSelect, MatInputModule, ReactiveFormsModule, MatFormFieldModule, FormsModule, MatTooltip, MatPaginatorModule, MatIconModule],
  templateUrl: './products-client-view.component.html',
  styleUrl: './products-client-view.component.css'
})
export class ProductsClientViewComponent {
  products: Products[] = [];
  company: CompanyInfo | null = null;
  productTypes: ProductType[] = [];
  loading: boolean = true;
  pagedResult: PagedResult<Products> | null = null;
  search: ProductSearch = {
    page: undefined,
    pageSize: undefined,
    name: undefined,
    productType: undefined,
    isActive: true
  };

  constructor(private productService: ProductService, private companyService: CompanyService, private productTypeService: ProductTypeService, private router: Router) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });

    this.getProductTypes();
    this.getProducts();
  }

  getProducts() {
    this.productService.getProductsByCompanyId('GetProductsByCompanyId', this.company!.companyId, this.search)
      .subscribe(data => {
        this.pagedResult = data;
        this.products = data.items.filter(p => p.currentPricePerUnit !== null && p.currentPricePerUnit !== undefined);
        this.loading = false;
      });
  }

  getProductTypes() {
    this.productTypeService.getAll('GetAll')
      .subscribe(data => {
        this.productTypes = data;
      })
  }

   onPageChange(event: PageEvent) {
      this.search.page = event.pageIndex;
      this.search.pageSize = event.pageSize;
      this.getProducts();
    }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

  Search() {
    this.getProducts();
  }

  ResetFilter() {
    this.search = {
      name: undefined,
      productType: undefined,
      isActive: true
    }

    this.getProducts();
  }

  showProductDeatils(product: Products) {
    this.router.navigate(['main-page/product-details-view'], { state: { product } });
  }
}
