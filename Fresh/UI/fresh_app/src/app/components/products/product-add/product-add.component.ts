import { Component } from '@angular/core';
import { ProductType } from '../../../model/ProductType';
import { ProductTypeService } from '../../../services/product-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductInsertRequest } from '../../../model/requests/ProductInsertRequest';
import { ProductService } from '../../../services/product.service';
import Swal from 'sweetalert2';
import { MyErrorStateMatcher } from '../../../helper/error_state_matcher';
import { UnitType } from '../../../model/UnitType';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatOption, MatSelectModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  productTypes: ProductType[] = [];
  addProductForms!: FormGroup;
  companyId: number;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  UnitType = UnitType;
  matcher = new MyErrorStateMatcher();

  unitsType: UnitType[] = Object.values(this.UnitType).filter(v => !isNaN(Number(v))) as UnitType[];

  constructor(private productTypeService: ProductTypeService, private productService: ProductService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
  }

  ngOnInit(): void {
    this.addProductForms = this.formBuilder.group({
      name: ['', Validators.required],
      image: [null as string | null],
      unit: [this.UnitType.Kilogram, Validators.required],
      productTypeId: ['', Validators.required],
      isActive: [true, Validators.required]
    });

    this.getProductType();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;

        const base64 = (reader.result as string).split(',')[1];

        this.addProductForms.patchValue({
          image: base64
        });

        this.addProductForms.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  getProductType() {
    this.productTypeService.getAll('GetAll')
      .subscribe(data => {
        this.productTypes = data;
      });
  }

  cancel() {
    this.router.navigate(['/main-page/products']);
  }

  onSubmit() {
    if (this.addProductForms.valid) {
      const formValues = this.addProductForms.value;

      const newProduct = new ProductInsertRequest(
        formValues.name,
        formValues.image,
        formValues.unit,
        formValues.isActive,
        formValues.productTypeId
      );

      this.productService.insert('Insert', this.companyId, newProduct)
        .subscribe({
          next: response => {
            Swal.fire({
              icon: 'success',
              title: 'New product added successfully!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'green',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(result => {
              if (result.isConfirmed) {
                this.router.navigate(['/main-page/products']);
                this.addProductForms.reset();
              }
            });
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to add new product!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'grey',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        });
    }
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
