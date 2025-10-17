import { Component } from '@angular/core';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from "@angular/router";
import { CompanyService } from '../../services/company.service';
import { SignalRService } from '../../SignalR/signal-r.service';
import { NotificationService } from '../../services/notification.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NavigationBarComponent, HeaderComponent, RouterOutlet, CommonModule, MatProgressSpinnerModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  company: CompanyInfo | null = null;
  loading: boolean = true;

  constructor(private companyService: CompanyService, private signalRService: SignalRService, private notificationService: NotificationService,) { }

  async ngOnInit(): Promise<void> {
    this.companyService.loadCompanyInformation('CompanyInformation');

    this.companyService.companyInfo$.subscribe(async data => {
      if (data) {
        this.company = data;
        this.loading = false;

        await this.signalRService.startConnection(this.company!.companyId.toString());

        this.signalRService.hubConnection.on('ReciveNotificationAdded', (data) => {
          this.notificationService.addedNotification(data);
          this.notificationService.increaseCount();
        });

        this.signalRService.hubConnection.on('ReciveNotificationUpdated', (data) => {
          this.notificationService.updatedNotification(data);
        });

        this.signalRService.hubConnection.on('ReciveNotificationDeleted', (data) => {
          this.notificationService.deletedNotification(data);
        });
      }
    });
  }

}
