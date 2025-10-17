import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { ClientService } from './client.service';
import { Clients } from '../model/Clients';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {

  constructor(private readonly keycloakService: KeycloakService, private router: Router, private clientService: ClientService) { }

  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  login(): void {
    this.keycloakService.login();
  }

  async redirectAfterLogin(): Promise<void> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();

    const userRole: string[] = this.keycloakService.getUserRoles();

    if (!isLoggedIn) return;

    if (userRole.includes('client')) {
      return new Promise<void>((resolve, reject) => {
        this.clientService.GetClientInfo().subscribe({
          next: (client: Clients) => {
            if (client) {
              this.router.navigate(['/main-page/dashboard-view']).then(() => resolve());
            }
          },
          error: (err) => {
            if (err.status === 401 || err.status === 403) {
              Swal.fire({
                icon: 'error',
                title: 'Login error',
                text: 'Your account is inactive. Contact support.',
                confirmButtonText: 'OK',
                confirmButtonColor: 'grey',
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then(result => {
                if (result.isConfirmed) {
                  this.logout();
                }
              });
            } else {
              reject();
            }
          }
        });
      });
    } else {
      await this.router.navigate(['/main-page']);
    }
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin + '/');
  }

  loadProfile(): Promise<any> {
    return new Promise<any>((resolve) => {
      if (this.keycloakService.isLoggedIn()) {
        this.keycloakService.loadUserProfile()
          .then(data => resolve(data))
          .catch(error => console.log(error))
      } else {
        console.log('user not logged in !')
      }
    });
  }

  getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}
