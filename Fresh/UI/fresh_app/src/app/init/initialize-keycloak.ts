import { KeycloakService } from "keycloak-angular";
import { environment } from "../../environments/environment";

export function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: environment.keycloak.authority,
                realm: environment.keycloak.realm,
                clientId: environment.keycloak.clientId,
            },
            enableBearerInterceptor: true,
            bearerPrefix: 'Bearer',
            bearerExcludedUrls: ['/assets'],
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html',
            },
        });
}