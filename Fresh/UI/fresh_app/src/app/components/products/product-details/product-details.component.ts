import { Component, ɵprovideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../../model/Products';
import { ProductPriceService } from '../../../services/product-price.service';
import { ProductPrice } from '../../../model/ProductPrice';
import { CommonModule } from '@angular/common';
import { ProductAddPriceComponent } from '../product-add-price/product-add-price.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { ProductPriceUpdateRequest } from '../../../model/requests/ProductPriceUpdateRequest';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductSearch } from '../../../model/search/ProductSearch';
import { ProductPriceSearch } from '../../../model/search/ProductPriceSearch';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagedResult } from '../../../model/PagedResult';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-details',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatProgressSpinner, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: Products;
  productPrices: ProductPrice[] = [];
  selectedDate: Date | null = null;
  pagedResult: PagedResult<ProductPrice> | null = null;
  loading: boolean = true;
  search: ProductPriceSearch = {
    page: undefined,
    pageSize: undefined,
    date: undefined
  };

  constructor(private router: Router, private productPriceService: ProductPriceService, private dialog: MatDialog) {
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
        this.productPrices = data.items;
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent) {
    this.search.page = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getProductPrice();
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png';
    return 'data:image/png;base64,' + imageData;
  }

  cancel() {
    this.router.navigate(['/main-page/products']);
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

  ChangeProductPrice(product: Products) {
    const dialogRef = this.dialog.open(ProductAddPriceComponent, {
      width: '500px',
      disableClose: true,
      data: product
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response !== undefined) {
        Swal.fire({
          icon: 'success',
          title: `Successfully added price for product`,
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(result => {
          if (result.isConfirmed) {
            this.getProductPrice();
            this.product.currentPricePerUnit = response.pricePetUnit;
          }
        });
      }
    });
  }

  SetPrice(productPrice: ProductPrice) {

    const setPrice = new ProductPriceUpdateRequest(
      productPrice.pricePerUnit,
      new Date(),
      productPrice.productId
    );

    this.productPriceService.update('Update', productPrice.id, setPrice)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Price set successfully !',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getProductPrice();
              this.product.currentPricePerUnit = response.pricePerUnit;
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Error setting price !',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });

  }

  Delete(id: number) {
    this.productPriceService.delete('Delete', id)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Product price successfully deleted!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getProductPrice();
              this.product.currentPricePerUnit = undefined;
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete product price!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }

}
