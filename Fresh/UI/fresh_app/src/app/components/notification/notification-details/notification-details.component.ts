import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../model/Notification';
import { CommonModule } from '@angular/common';
import { KeycloakAuthService } from '../../../services/keycloakAuth.service';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.css'
})
export class NotificationDetailsComponent {
  notification: Notification | null = null;
  userRoles: string[] = [];

  constructor(private router: Router, private keycloakService: KeycloakAuthService) {
    const navigation = this.router.getCurrentNavigation();
    this.notification = navigation?.extras.state?.['notification'];
  }

  ngOnInit(): void {
    this.userRoles = this.keycloakService.getRoles();
  }

  cancel() {
    if (this.hasRole('admin')) {
      this.router.navigate(['main-page/notification']);

    } else if (this.hasRole('client')) {
      this.router.navigate(['main-page/notification-list']);
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

}
