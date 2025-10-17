import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { KeycloakAuthService } from '../../services/keycloakAuth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private readonly keycloakService: KeycloakAuthService) { }

  login() {
    this.keycloakService.login();
  }
}
