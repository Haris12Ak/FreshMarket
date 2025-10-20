import { ChangeDetectorRef, Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CompanyService } from '../../services/company.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Notification } from '../../model/Notification';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import Swal from 'sweetalert2';
import { NotificationClientViewComponent } from "../../client-side/notification-client-view/notification-client-view.component";
import { KeycloakAuthService } from '../../services/keycloakAuth.service';
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NotificationSearch } from '../../model/search/NotificationSearch';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, FormsModule, MatButtonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatProgressSpinner, MatPaginatorModule, MatIconModule, MatTooltipModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications = new MatTableDataSource<Notification>();
  company: CompanyInfo | null = null;
  displayedColumns: string[] = ['title', 'content', 'createdAt', 'actions'];
  loading: boolean = true;
  userRoles: string[] = [];
  pagedResult: PagedResult<Notification> | null = null;
  search: NotificationSearch = {
    page: undefined,
    pageSize: undefined,
    isCompanyIncluded: undefined
  }

  constructor(private notificationService: NotificationService, private companyService: CompanyService, private router: Router, private readonly keycloakService: KeycloakAuthService) { }

  async ngOnInit(): Promise<void> {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
      if (data) {
        this.userRoles = this.keycloakService.getRoles();

        this.notificationService.notifications$.subscribe(data => {
          this.notifications.data = data;

        })

        this.notificationService.resetCount();

        this.getNotifications();
      }
    });
  }

  getNotifications() {
    this.notificationService.getAll('GetAll', this.company!.companyId, this.search)
      .subscribe(data => {
        this.pagedResult = data;
        this.notificationService.setAllNotifications(data.items);
        this.loading = false;
      });
  }

  onPageChange(event: PageEvent) {
    this.search.page = event.pageIndex;
    this.search.pageSize = event.pageSize;
    this.getNotifications();
  }

  goToAddNotification(notificationId?: number) {
    if (notificationId) {
      this.router.navigate(['main-page/edit-notification', this.company!.companyId, notificationId!]);
    } else {
      this.router.navigate(['main-page/add-notification', this.company!.companyId]);
    }
  }

  Details(notification: Notification) {
    this.router.navigate(['main-page/notification-details'], { state: { notification } });
  }

  Delete(notificationId: number) {
    this.notificationService.delete(this.company!.companyId, notificationId)
      .subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            title: 'Notification successfully deleted!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'green',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(result => {
            if (result.isConfirmed) {
              this.getNotifications();
            }
          });
        },
        error: error => {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete notification!',
            confirmButtonText: 'OK',
            confirmButtonColor: 'grey',
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      });
  }
}
