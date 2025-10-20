import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakAuthService } from './services/keycloakAuth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fresh_app';
  loading: boolean = true;

  constructor(private readonly keycloakService: KeycloakAuthService) { }

  async ngOnInit() {
    try {
      await this.keycloakService.redirectAfterLogin();
    } finally {
      this.loading = false;
    }
  }
}
