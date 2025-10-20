import { Component, inject, model, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Products } from '../../model/Products';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompanyService } from '../../services/company.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductSearch } from '../../model/search/ProductSearch';
import { MatSelectModule } from '@angular/material/select';
import { ProductType } from '../../model/ProductType';
import { ProductTypeService } from '../../services/product-type.service';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ProductAddPriceComponent } from './product-add-price/product-add-price.component';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, FormsModule, MatButtonModule, RouterModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, MatFormFieldModule, MatProgressSpinner, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = new MatTableDataSource<Products>();
  company: CompanyInfo | null = null;
  displayedColumns: string[] = ['name', 'image', 'currentProductPrice', 'unit', 'productType', 'isActive', 'actions'];
  productTypes: ProductType[] = [];
  loading: boolean = true;
  pagedResult: PagedResult<Products> | null = null;
  search: ProductSearch = {
    page: undefined,
    pageSize: undefined,
    name: undefined,
    productType: undefined,
    isActive: undefined
  };

  isActiveList = [
    { 'name': 'Yes', 'value': true },
    { 'name': 'No', 'value': false }
  ]

  constructor(private productService: ProductService, private companyService: CompanyService, private router: Router, private productTypeService: ProductTypeService, private dialog: MatDialog) { }

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
        this.products.data = data.items;
        this.loading = false
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

  goToAddProduct() {
    this.router.navigate(['/main-page/add-product', this.company!.companyId]);
  }

  goToEditProduct(product: Products) {
    this.router.navigate(['/main-page/edit-product'], { state: { product } });
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

  deleteProduct(id: number) {
    this.productService.delete('Delete', id)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Product successfully deleted!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getProducts();
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete product!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }

  Search() {
    this.getProducts();
  }

  ResetFilter() {
    this.search = {
      name: undefined,
      productType: undefined,
      isActive: undefined
    }

    this.getProducts();
  }

  AddProductPrice(product: Products) {
    const dialogRef = this.dialog.open(ProductAddPriceComponent, {
      width: '500px',
      disableClose: true,
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        Swal.fire({
          icon: 'success',
          title: `Successfully added price for product`,
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(result => {
          if (result.isConfirmed) {
            this.getProducts();
          }
        });
      }
    });
  }

  goToDetailsProduct(product: Products) {
    this.router.navigate(['/main-page/product-details'], { state: { product } });
  }
}
