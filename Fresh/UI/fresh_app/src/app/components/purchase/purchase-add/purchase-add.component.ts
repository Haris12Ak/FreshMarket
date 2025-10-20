import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Purchase } from '../../../model/Purchase';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseService } from '../../../services/purchase.service';
import { ProductService } from '../../../services/product.service';
import { Products } from '../../../model/Products';
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { PurchaseInsertRequest } from '../../../model/requests/PurchaseInsertRequest';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PurchaseDialogData } from '../../../model/PurchaseDialogData';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PaymentType } from '../../../model/PaymentType';
import { PurchaseUpdateRequest } from '../../../model/requests/PurchaseUpdateRequest';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-purchase-add',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatOption, MatSelectModule, MatDividerModule, CommonModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './purchase-add.component.html',
  styleUrl: './purchase-add.component.css'
})
export class PurchaseAddComponent {
  purchaseForm: FormGroup;
  products: Products[] = [];
  PaymentType = PaymentType;

  paymentsType: PaymentType[] = Object.values(this.PaymentType).filter(v => !isNaN(Number(v))) as PaymentType[];

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<PurchaseAddComponent>, @Inject(MAT_DIALOG_DATA) public data: PurchaseDialogData, private purchaseService: PurchaseService, private productService: ProductService) {
    this.purchaseForm = this.formBuilder.group({
      quantity: [null, Validators.required],
      productId: [{ value: null, disabled: this.data.mode === 'edit' }, Validators.required],
      paymentType: [{ value: this.PaymentType.Immediate, disabled: this.data.mode === 'edit' }, Validators.required],
      numberOfInstallments: [{ value: null, disabled: this.data.mode === 'edit' }, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    this.purchaseForm.get('paymentType')?.valueChanges.subscribe(value => {
      if (value === PaymentType.Installments) {
        this.purchaseForm.get('numberOfInstallments')?.setValue(3);
        this.purchaseForm.get('numberOfInstallments')?.setValidators([Validators.required, Validators.min(1)]);
      }
      else {
        this.purchaseForm.get('numberOfInstallments')?.setValue(null);
        this.purchaseForm.get('numberOfInstallments')?.clearValidators();
      }
      this.purchaseForm.get('numberOfInstallments')?.updateValueAndValidity();
    });

    this.getProducts();

    if (this.data.mode === 'edit' && this.data.purchase) {
      this.purchaseForm.patchValue({
        quantity: this.data.purchase.quantity,
        productId: this.data.purchase.productId,
        paymentType: this.data.purchase.paymentType,
        numberOfInstallments: this.data.purchase.numberOfInstallments
      });
    }
  }

  getProducts() {
    this.productService.getProductsByCompanyId('GetProductsByCompanyId', this.data.companyId)
      .subscribe(result => {
        this.products = result.items;
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      const formsValue = this.purchaseForm.value;

      if (this.data.mode === 'add' && this.data.purchase == null) {
        const newPurchase = new PurchaseInsertRequest(
          formsValue.quantity,
          this.data.client.clientId,
          formsValue.productId,
          formsValue.paymentType,
          formsValue.numberOfInstallments
        );

        this.purchaseService.insert('Insert', this.data.companyId, newPurchase)
          .subscribe({
            next: response => {
              this.dialogRef.close(response);
            },
            error: () => this.showError('There is no price set for the selected product! Please set a price to successfully add a purchase !')
          });

      } else if (this.data.mode === 'edit' && this.data.purchase != null) {

        const updatePurchase = new PurchaseUpdateRequest(
          formsValue.quantity,
          this.data.purchase.productId
        );

        this.purchaseService.update(this.data.companyId, this.data.purchase.id, updatePurchase)
          .subscribe({
            next: response => {
              this.dialogRef.close(response);
            },
            error: () => this.showError('Error editing purchase !')
          });
      }
    }
  }

  private showError(content: string) {
    Swal.fire({
      icon: 'error',
      title: content,
      confirmButtonText: 'OK',
      confirmButtonColor: 'grey',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  paymentTypeLabel(type: PaymentType): string {
    switch (type) {
      case PaymentType.Immediate:
        return "Immediate";
      case PaymentType.Monthly:
        return "Monthly";
      case PaymentType.Installments:
        return "Installments";
      default:
        return "Unknown";
    }
  }
}
