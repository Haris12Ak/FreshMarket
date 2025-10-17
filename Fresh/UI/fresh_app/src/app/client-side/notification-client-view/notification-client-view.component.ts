import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CompanyService } from '../../services/company.service';
import { Notification } from '../../model/Notification';
import { CompanyInfo } from '../../model/CompanyInfo';
import { KeycloakAuthService } from '../../services/keycloakAuth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PagedResult } from '../../model/PagedResult';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NotificationSearch } from '../../model/search/NotificationSearch';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification-client-view',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './notification-client-view.component.html',
  styleUrl: './notification-client-view.component.css'
})
export class NotificationClientViewComponent {
  notifications: Notification[] = [];
  company: CompanyInfo | null = null;
  loading: boolean = true;
  pagedResult: PagedResult<Notification> | null = null;
  search: NotificationSearch = {
    page: undefined,
    pageSize: undefined,
    isCompanyIncluded: undefined
  }

  constructor(private notificationService: NotificationService, private companyService: CompanyService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
      if (data) {
        this.notificationService.notifications$.subscribe(data => {
          this.notifications = data;
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

  showDetails(notification: Notification) {
    this.router.navigate(['main-page/notification-details'], { state: { notification } });
  }
}
