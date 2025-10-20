import { Component } from '@angular/core';
import { KeycloakAuthService } from '../../services/keycloakAuth.service';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { CompanyInfo } from '../../model/CompanyInfo';
import { RouterLink, RouterModule } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, MatBadgeModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
  userRoles: string[] = [];
  company: CompanyInfo | null = null;

  constructor(private readonly keycloakService: KeycloakAuthService, private companyService: CompanyService, public notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getRoles();

    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

}
