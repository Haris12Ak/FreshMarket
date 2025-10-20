import { Component } from '@angular/core';
import { PurchasesClientDto } from '../../../model/PurchasesClientDto';
import { ActivatedRoute, Router } from '@angular/router';
import { Purchase } from '../../../model/Purchase';
import { PurchaseService } from '../../../services/purchase.service';
import { CompanyInfo } from '../../../model/CompanyInfo';
import { CompanyService } from '../../../services/company.service';
import { PurchaseSearch } from '../../../model/search/PurchaseSearch';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import { PaymentType } from '../../../model/PaymentType';
import { Payment } from '../../../model/Payment';
import { MatDivider } from "@angular/material/divider";
import { paymentTypeLabel } from '../../../helper/payment_type';
import { PurchaseUpdateRequest } from '../../../model/requests/PurchaseUpdateRequest';
import Swal from 'sweetalert2';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { KeycloakAuthService } from '../../../services/keycloakAuth.service';

@Component({
  selector: 'app-purchase-details',
  standalone: true,
  imports: [MatProgressSpinner, CommonModule, MatDivider, MatButtonModule, MatIconModule],
  templateUrl: './purchase-details.component.html',
  styleUrl: './purchase-details.component.css'
})
export class PurchaseDetailsComponent {
  purchase: Purchase | null = null;
  purchaseId: number;
  company: CompanyInfo | null = null;
  loading: boolean = true;
  mode: string;
  userRoles: string[] = [];
  search: PurchaseSearch = {
    isProductIncluded: true,
    isClientIncluded: true,
    isPaymentsIncluded: true
  }

  paymentTypeLabel = paymentTypeLabel;

  constructor(private route: ActivatedRoute, private router: Router, private purchaseService: PurchaseService, private companyService: CompanyService, private keycloakService: KeycloakAuthService) {
    this.purchaseId = Number(this.route.snapshot.paramMap.get('purchaseId'));
    const navigation = this.router.getCurrentNavigation();
    this.mode = navigation?.extras.state?.['mode'];
  }

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getRoles();

    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });

    this.getPurchases();
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  getPurchases() {
    this.purchaseService.getById(this.company!.companyId, this.purchaseId, this.search)
      .subscribe(data => {
        this.purchase = data;
        this.loading = false;
      });
  }

  isPurchasePaid(purchase: Purchase): boolean {
    const dateTimeNow: Date = new Date();
    const totalPaid = purchase.payments
      .filter((p: Payment) => new Date(p.paymentDate) <= dateTimeNow)
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return totalPaid >= purchase.totalAmount;
  }

  getRemainingDebt(purchase: Purchase): number {
    const dateTimeNow: Date = new Date();
    const totalAmount = purchase.totalAmount;
    const totalPaid = purchase.payments
      .filter((p: Payment) => new Date(p.paymentDate) <= dateTimeNow)
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return Math.max(totalAmount - totalPaid, 0);
  }

  cancel() {
    if (this.mode === 'admin') {
      this.router.navigate(['/main-page/purchase']);
    } else {
      this.router.navigate(['/main-page/purchase-list']);
    }
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png';
    return 'data:image/png;base64,' + imageData;
  }

  immediatePayment(purchase: Purchase) {
    const data: PurchaseUpdateRequest = {
      quantity: purchase.quantity,
      productId: purchase.productId,
      paymentType: PaymentType.Immediate
    }

    this.purchaseService.update(this.company!.companyId, purchase.id, data)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Successful payment to client.',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getPurchases();
            }
          });
        },
        error: error => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Payment error!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }
}
