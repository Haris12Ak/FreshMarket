import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './init/initialize-keycloak';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideRouter(routes),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    }, provideAnimationsAsync(),
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ]
};
