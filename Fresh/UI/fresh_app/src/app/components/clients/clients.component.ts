import { Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Clients } from '../../model/Clients';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Router, RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { ClientSearch } from '../../model/search/ClientSearch';
import { FormsModule } from '@angular/forms';
import { PagedResult } from '../../model/PagedResult';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CdkTable, CdkTableModule } from "@angular/cdk/table";
import { CompanyInfo } from '../../model/CompanyInfo';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule, MatInputModule, FormsModule, MatProgressSpinnerModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {
  clients = new MatTableDataSource<Clients>();
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phone', 'createdAt', 'actions'];
  pagedResult: PagedResult<Clients> | null = null;
  company: CompanyInfo | null = null;
  loading: boolean = true;

  search: ClientSearch = {
    page: undefined,
    pageSize: undefined,
    firstName: undefined,
    lastName: undefined
  };

  constructor(private clientService: ClientService, private router: Router, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    })

    this.getClientsByCompany();
  }

  getClientsByCompany() {
    this.clientService.getClientsByCompany('GetClientsByCompany', this.search)
      .subscribe(data => {
        this.clients.data = data.items;
        this.pagedResult = data;
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent) {
    this.search.page = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getClientsByCompany();
  }

  goToAddClient() {
    this.router.navigate(['/main-page/add-client']);
  }

  deleteClient(clientId: number) {
    const isActive: boolean = false;

    this.clientService.deactivate(clientId, this.company!.companyId, isActive)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Client successfully deleted!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getClientsByCompany();
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete client!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }

  Search() {
    this.getClientsByCompany();
  }

  ResetFilter() {
    this.search = {
      page: undefined,
      pageSize: undefined,
      firstName: undefined,
      lastName: undefined,
    }

    this.getClientsByCompany();
  }
}
