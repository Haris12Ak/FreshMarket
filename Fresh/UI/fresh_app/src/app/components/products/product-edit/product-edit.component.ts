import { Component } from '@angular/core';
import { Products } from '../../../model/Products';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductTypeService } from '../../../services/product-type.service';
import { ProductType } from '../../../model/ProductType';
import { ProductService } from '../../../services/product.service';
import { ProductUpdateRequest } from '../../../model/requests/ProductUpdateRequest';
import Swal from 'sweetalert2';
import { MyErrorStateMatcher } from '../../../helper/error_state_matcher';
import { UnitType } from '../../../model/UnitType';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {
  product: Products;
  editProductForms!: FormGroup;
  productTypes: ProductType[] = [];
  previewUrl: string | null = null;
  matcher = new MyErrorStateMatcher();
  UnitType = UnitType;
  unitsType: UnitType[] = Object.values(this.UnitType).filter(v => !isNaN(Number(v))) as UnitType[];

  constructor(private router: Router, private formBuilder: FormBuilder, private productTypeService: ProductTypeService, private productService: ProductService) {
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'];
    console.log(this.product);
  }

  ngOnInit(): void {
    this.getProductType();

    const stringToUnitEnumMap: { [key: string]: UnitType } = {
      "Kilogram": UnitType.Kilogram,
      "Gram": UnitType.Gram,
      "Liter": UnitType.Liter
    };

    this.editProductForms = this.formBuilder.group({
      name: [this.product.name || '', Validators.required],
      unit: [stringToUnitEnumMap[this.product.unit] ?? '', Validators.required],
      productTypeId: [this.product.productTypeId || '', Validators.required],
      isActive: [this.product.isActive ?? true, Validators.required],
      image: [this.product?.image || null]
    });
  }

  getProductType() {
    this.productTypeService.getAll('GetAll')
      .subscribe(data => {
        this.productTypes = data;
      });
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return
    } else {
      const reader = new FileReader();
      reader.onload = () => {

        const base64 = (reader.result as string).split(',')[1];

        this.editProductForms.patchValue({
          image: base64
        });

        this.editProductForms.get('image')?.updateValueAndValidity();

        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    if (this.editProductForms.valid) {

      const formValues = this.editProductForms.value;

      const editProduct = new ProductUpdateRequest(
        formValues.name,
        formValues.image,
        formValues.unit,
        formValues.isActive,
        formValues.productTypeId
      );

      this.productService.update('Update', this.product.id, editProduct)
        .subscribe({
          next: response => {
            Swal.fire({
              icon: 'success',
              title: 'Product edited successfully!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'green',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(result => {
              if (result.isConfirmed) {
                this.router.navigate(['/main-page/products']);
                this.editProductForms.reset();
              }
            });
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to edit product!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'grey',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/main-page/products']);
  }

  unitTypeLabel(type: UnitType): string {
    switch (type) {
      case UnitType.Kilogram:
        return "Kilogram (kg)";
      case UnitType.Gram:
        return "Gram (g)";
      case UnitType.Liter:
        return "Liter (l)";
      default:
        return "Unknown";
    }
  }

}
