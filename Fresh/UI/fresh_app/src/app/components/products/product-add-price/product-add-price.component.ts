import { Component, Inject, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogData } from '../products.component';
import { Products } from '../../../model/Products';
import { ProductPriceInsertRequest } from '../../../model/requests/ProductPriceInsertRequest';
import { ProductPriceService } from '../../../services/product-price.service';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-add-price',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
    MatIconModule],
  templateUrl: './product-add-price.component.html',
  styleUrl: './product-add-price.component.css'
})
export class ProductAddPriceComponent {

  priceForm: FormGroup;
  value: Date | undefined;

  constructor(public dialogRef: MatDialogRef<ProductAddPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Products,
    private formBuilder: FormBuilder, private productPriceService: ProductPriceService) {
    this.priceForm = this.formBuilder.group({
      pricePerUnit: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.priceForm.valid) {
      const formsValue = this.priceForm.value;

      const newPrice = new ProductPriceInsertRequest(
        formsValue.pricePerUnit
      );

      this.productPriceService.insert('Insert', this.data.id, newPrice)
        .subscribe({
          next: response => {
            this.dialogRef.close(newPrice);
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'The selected product price already exists. Please choose another price!!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'grey',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
