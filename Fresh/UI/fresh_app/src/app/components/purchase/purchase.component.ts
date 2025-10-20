import { Component, signal } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { Clients } from '../../model/Clients';
import { CompanyService } from '../../services/company.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Purchase } from '../../model/Purchase';
import { PurchaseAddComponent } from './purchase-add/purchase-add.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { findIndex } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getMatFormFieldPlaceholderConflictError, MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { PurchasesClientDto } from '../../model/PurchasesClientDto';
import { MatDivider } from "@angular/material/divider";
import { PaymentType } from '../../model/PaymentType';
import { Payment } from '../../model/Payment';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { paymentTypeLabel } from '../../helper/payment_type';
import { ProductTypeService } from '../../services/product-type.service';
import { ProductType } from '../../model/ProductType';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClientsPurchasesSearch } from '../../model/search/ClientsPurchasesSearch';
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { fakeAsync } from '@angular/core/testing';
import { PurchaseSearch } from '../../model/search/PurchaseSearch';
import { PurchaseFilteredData } from '../../model/PurchaseFilteredData';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-purchase',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatExpansionModule, CommonModule, MatButtonModule, MatProgressSpinnerModule, FormsModule, MatFormFieldModule, MatInputModule, MatDivider, MatOptionModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, FormsModule, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent {
  clientPurchases: PurchasesClientDto[] = [];
  company: CompanyInfo | null = null;
  loading: boolean = true;
  loadingPurchases: boolean = false;
  productTypes: ProductType[] = [];
  pagedResultClient: PagedResult<PurchasesClientDto> | null = null;
  purchaseFilteredData: PurchaseFilteredData | null = null;
  searchClient: ClientsPurchasesSearch = {
    page: undefined,
    pageSize: undefined,
    firstNameAndLastName: undefined,
  }

  paymentTypeLabel = paymentTypeLabel;

  panelStates: { [clientId: number]: boolean } = {};

  constructor(private purchaseService: PurchaseService, private companyService: CompanyService, private dialog: MatDialog, private router: Router, private productTypeService: ProductTypeService) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });

    this.getPtoductsType();
    this.getClientsByPurchases();

    const savedClientId = sessionStorage.getItem('openClientPanel');
    if (savedClientId) {
      this.panelStates = {};
      this.panelStates[+savedClientId] = true;
    }
  }

  isPurchasePaid(purchase: Purchase): boolean {
    const dateTimeNow: Date = new Date();
    const totalPaid = purchase.payments
      .filter((p: Payment) => new Date(p.paymentDate) <= dateTimeNow)
      .reduce((sum: number, p: Payment) => sum + p.amount, 0);

    return totalPaid >= purchase.totalAmount;
  }

  getPtoductsType() {
    this.productTypeService.getAll('GetAll')
      .subscribe(data => {
        this.productTypes = data;
      });
  }

  onPageChange(event: PageEvent) {
    this.searchClient.page = event.pageIndex;
    this.searchClient.pageSize = event.pageSize;
    this.getClientsByPurchases();
  }

  onPageChangePurchases(event: PageEvent, client: PurchasesClientDto) {
    client.searchPurchases.page = event.pageIndex;
    client.searchPurchases.pageSize = event.pageSize;
    this.getPurchasesByClient(client);
  }

  isPanelOpen(clientId: number): boolean {
    return !!this.panelStates[clientId];
  }

  onPanelOpened(client: PurchasesClientDto) {
    this.getPurchasesByClient(client);
    this.panelStates[client.clientId] = true;
  }

  onPanelClosed(clientId: number) {
    this.panelStates[clientId] = false;
    const savedClientId = sessionStorage.getItem('openClientPanel');
    if (savedClientId && +savedClientId === clientId) {
      sessionStorage.removeItem('openClientPanel');
    }
  }

  getClientsByPurchases() {
    this.purchaseService.GetClientsByPurchases('GetClientsByPurchases', this.company!.companyId, this.searchClient)
      .subscribe((data: PagedResult<PurchasesClientDto>) => {
        this.pagedResultClient = data;
        this.clientPurchases = data.items.map(client => {
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

        if (this.searchClient.firstNameAndLastName != undefined && this.searchClient.firstNameAndLastName != null) {
          this.panelStates = {};
          this.clientPurchases.forEach(client => {
            this.panelStates[client.clientId] = true;
          });
        }

        this.loading = false;
      })
  }

  getPurchasesByClient(client: PurchasesClientDto) {
    this.loadingPurchases = true;
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

          this.purchaseFilteredData = {
            totalPurchases: client.purchases.length,
            totalQuantity: totalQuantity,
            totalEarnings: totalEarnings,
            totalPaid: totalPaid,
            totalDebt: totalDebt
          }
        } else {
          this.purchaseFilteredData = null;
        }

        this.loadingPurchases = false;
      });
  }

  getImageSrc(imageData: string | null): string {
    if (!imageData) return 'assets/images/no-image.png'; // fallback
    return 'data:image/png;base64,' + imageData;
  }

  AddPurchase(client: PurchasesClientDto) {
    const dialogRef = this.dialog.open(PurchaseAddComponent, {

      width: '500px',
      disableClose: true,
      data: { mode: 'add', client: client, companyId: this.company!.companyId, purchase: null }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response !== undefined) {
        Swal.fire({
          icon: 'success',
          title: `Successfully added purchase !`,
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(alterResult => {
          if (alterResult.isConfirmed) {
            const clientId = client.clientId;
            this.getClientsByPurchases();
            this.panelStates[clientId] = true;
          }
        });
      }
    });
  }

  EditPurchase(client: PurchasesClientDto, purchase: Purchase) {
    const dialogRef = this.dialog.open(PurchaseAddComponent, {
      width: '500px',
      disableClose: true,
      data: { mode: 'edit', client: client, companyId: this.company!.companyId, purchase: purchase }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response !== undefined) {
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: `Purchase successfully edited !`,
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(alterResult => {
          if (alterResult.isConfirmed) {
            const clientId = client.clientId;
            this.getClientsByPurchases();
            this.panelStates[clientId] = true;
          }
        });
      }
    });
  }

  DeletePurchase(purchaseId: number) {
    this.purchaseService.delete(this.company!.companyId, purchaseId)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Purchase successfully deleted!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              const clientId = response.clientId;
              this.getClientsByPurchases();
              this.panelStates[clientId] = true;
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete purchase!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }

  ShowDetails(purchaseId: number, clientId: number) {
    sessionStorage.setItem('openClientPanel', clientId.toString());

    this.router.navigate(['/main-page/purchase-details', purchaseId], { state: { mode: 'admin' } });
  }

  Search() {
    this.getClientsByPurchases();
  }

  ResetFilter() {
    this.searchClient = {
      firstNameAndLastName: undefined,
    }

    this.panelStates = {};

    this.getClientsByPurchases();
  }

  SearchPurchases(client: PurchasesClientDto) {
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

  ResetFilterPurchases(client: PurchasesClientDto) {
    client.searchPurchases = {
      productType: undefined,
      dateFrom: undefined,
      dateTo: undefined
    }

    this.purchaseFilteredData = {
      totalPurchases: undefined,
      totalQuantity: undefined,
      totalEarnings: undefined,
      totalPaid: undefined,
      totalDebt: undefined
    }

    this.purchaseFilteredData = null;

    this.getPurchasesByClient(client);
  }

  downloadCsv() {
    this.purchaseService.getAllPurchasesCsv('generate-csv', this.company!.companyId)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'purchases.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  downloadPdf(purchaseId: number) {
    this.purchaseService.printPdf('report', this.company!.companyId, purchaseId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'purchase-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
