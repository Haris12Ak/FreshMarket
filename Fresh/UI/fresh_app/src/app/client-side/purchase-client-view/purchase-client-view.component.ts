import { Component } from '@angular/core';
import { PurchasesClientDto } from '../../model/PurchasesClientDto';
import { PurchaseService } from '../../services/purchase.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CompanyService } from '../../services/company.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import { paymentTypeLabel } from '../../helper/payment_type';
import { Purchase } from '../../model/Purchase';
import { Payment } from '../../model/Payment';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClientsPurchasesSearch } from '../../model/search/ClientsPurchasesSearch';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../model/ProductType';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { PurchaseSearch } from '../../model/search/PurchaseSearch';
import { ClientPurchasesInfo } from '../../model/ClientPurchasesInfo';
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PurchaseFilteredData } from '../../model/PurchaseFilteredData';
import { MatDivider } from "@angular/material/divider";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-purchase-client-view',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatProgressSpinner, CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatPaginatorModule, MatDivider, MatIconModule, MatTooltipModule],
  templateUrl: './purchase-client-view.component.html',
  styleUrl: './purchase-client-view.component.css'
})
export class PurchaseClientViewComponent {
  purchasesClient: ClientPurchasesInfo[] = [];
  pagedResult: PagedResult<ClientPurchasesInfo> | null = null;
  company: CompanyInfo | null = null;
  loading = true;
  productTypes: ProductType[] = [];
  purchaseFilteredData: PurchaseFilteredData | null = null;

  paymentTypeLabel = paymentTypeLabel;

  constructor(private purchaseService: PurchaseService, private readonly companyService: CompanyService, private router: Router, private productTypeService: ProductTypeService) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;

    });

    this.getPtoductsType();
    this.getPurchasesClient();
  }

  getPurchasesClient() {
    this.purchaseService.GetClientPurchasesInfo('GetClientPurchasesInfo', this.company!.companyId)
      .subscribe(data => {
        this.pagedResult = data;
        this.purchasesClient = data.items.map(client => {
          return {
            ...client,
            searchPurchases: {
              page: undefined,
              pageSize: undefined,
              productType: undefined,
              dateFrom: undefined,
              dateTo: undefined
            },
            pagedPurchases: undefined
          }
        });

        this.purchasesClient.forEach(client => {
          this.getPurchasesByClient(client);
        });

        this.loading = false;
      });
  }

  getPtoductsType() {
    this.productTypeService.getAll('GetAll')
      .subscribe(data => {
        this.productTypes = data;
      });
  }

  getPurchasesByClient(client: ClientPurchasesInfo) {
    this.loading = true;
    this.purchaseService.GetPurchasesByClientId(this.company!.companyId, client.clientId, client.searchPurchases)
      .subscribe((data: PagedResult<Purchase>) => {
        client.pagedPurchases = data;
        client.purchases = data.items;

        if ((client.searchPurchases.productType != undefined
          || client.searchPurchases.dateFrom != undefined
          || client.searchPurchases.dateTo != undefined) && client.purchases.length > 0 && client.purchases) {

          const totalQuantity = client.purchases.reduce((sum, p) => sum + p.quantity, 0);
          const totalEarnings = client.purchases.reduce((sum, p) => sum + p.totalAmount, 0);
          const paid = client.purchases.filter(p => this.isPurchasePaid(p))
            .reduce((sum, p) => sum + p.totalAmount, 0);

          const totalPaid = paid;
          const totalDebt = totalEarnings - paid;

          const productQuantities = client.purchases.reduce((map, p) => {
            map[p.products.name] = (map[p.products.name] || 0) + p.quantity;
            return map;
          }, {} as { [key: string]: number });

          const mostSoldProduct = Object.entries(productQuantities)
            .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

          this.purchaseFilteredData = {
            totalPurchases: client.purchases.length,
            totalQuantity: totalQuantity,
            totalEarnings: totalEarnings,
            totalPaid: totalPaid,
            totalDebt: totalDebt,
            mostSoldProduct: mostSoldProduct
          }
        } else {
          this.purchaseFilteredData = null;
        }

        this.loading = false;
      });
  }

  onPageChangePurchases(event: PageEvent, client: ClientPurchasesInfo) {
    client.searchPurchases.page = event.pageIndex;
    client.searchPurchases.pageSize = event.pageSize;
    this.getPurchasesByClient(client);
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

  isPurchasePaid(purchase: Purchase): boolean {
    const dateTimeNow: Date = new Date();
    const totalPaid = purchase.payments
      .filter((p: Payment) => new Date(p.paymentDate) <= dateTimeNow)
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return totalPaid >= purchase.totalAmount;
  }

  ShowDetails(purchaseId: number) {
    this.router.navigate(['/main-page/purchase-details', purchaseId], { state: { mode: 'client' } });
  }

  Search(client: ClientPurchasesInfo) {
    if (client.searchPurchases.dateFrom != null && client.searchPurchases.dateFrom != undefined && client.searchPurchases.dateTo != null && client.searchPurchases.dateTo != undefined) {
      if (client.searchPurchases.dateFrom.getDate() >= client.searchPurchases.dateTo.getDate()) {
        Swal.fire({
          icon: 'error',
          title: 'Date From cannot be greater than Date To!',
          confirmButtonText: 'OK',
          confirmButtonColor: 'grey',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          client.searchPurchases.dateFrom = undefined;
          client.searchPurchases.dateTo = undefined;
          this.getPurchasesByClient(client);
        });
        return;
      }
    }

    client.searchPurchases;
    this.getPurchasesByClient(client);
  }

  ResetFilter(client: ClientPurchasesInfo) {
    client.searchPurchases = {
      productType: undefined,
      dateFrom: undefined,
      dateTo: undefined
    }
    this.getPurchasesClient();
  }
}
