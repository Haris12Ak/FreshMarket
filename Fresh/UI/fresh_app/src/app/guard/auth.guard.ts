import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data["roles"];
    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    if (state.url === "/main-page" || state.url === "/main-page/") {
        const userRoles = this.keycloak.getUserRoles();

        if (userRoles.includes("admin")) {
          this.router.navigate(["/main-page/dashboard"]);
          return false;
        } else if (userRoles.includes("client")) {
          this.router.navigate(["/main-page/dashboard-view"]);
          return false;
        }
      }

    const userRoles = this.keycloak.getUserRoles();

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
