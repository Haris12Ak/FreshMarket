import { Component } from '@angular/core';
import { KeycloakAuthService } from '../../services/keycloakAuth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  firstName: string = 'unknown';
  lastName: string = 'unknown';

  constructor(private readonly keycloakService: KeycloakAuthService) { }

  ngOnInit(): void {
    this.keycloakService.loadProfile().then(user => {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    });
  }
  
  logout() {
    this.keycloakService.logout();
  }

}
