export const environment = {
    production: true,
    keycloak: {
        authority: 'http://localhost:9090',
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200',
        realm: 'fresh',
        clientId: 'angular-client',
    },
    urlAddress: 'http://localhost:44301'
};
