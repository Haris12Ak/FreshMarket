import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { AuthGuard } from './guard/auth.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductsComponent } from './components/products/products.component';
import { ClientsComponent } from './components/clients/clients.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ClientAddComponent } from './components/clients/client-add/client-add.component';
import { ProductAddComponent } from './components/products/product-add/product-add.component';
import { ProductEditComponent } from './components/products/product-edit/product-edit.component';
import { ProductDetailsComponent } from './components/products/product-details/product-details.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationAddEditComponent } from './components/notification/notification-add-edit/notification-add-edit.component';
import { NotificationDetailsComponent } from './components/notification/notification-details/notification-details.component';
import { ProductsClientViewComponent } from './client-side/products-client-view/products-client-view.component';
import { ProductClientDetailsComponent } from './client-side/products-client-view/product-client-details/product-client-details.component';
import { PurchaseClientViewComponent } from './client-side/purchase-client-view/purchase-client-view.component';
import { PurchaseDetailsComponent } from './components/purchase/purchase-details/purchase-details.component';
import { DashboardClientViewComponent } from './client-side/dashboard-client-view/dashboard-client-view.component';
import { NotificationClientViewComponent } from './client-side/notification-client-view/notification-client-view.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'registration', component: RegistrationFormComponent
    },
    {
        path: 'forbidden', component: ForbiddenComponent, canActivate: [AuthGuard]
    },
    {
        path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'client'] },
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
            { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'add-client', component: ClientAddComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'add-product/:companyId', component: ProductAddComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'edit-product', component: ProductEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'product-details', component: ProductDetailsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'purchase', component: PurchaseComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'add-notification/:companyId', component: NotificationAddEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'edit-notification/:companyId/:notificationId', component: NotificationAddEditComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
            { path: 'notification-details', component: NotificationDetailsComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'client'] } },
            { path: 'products-list', component: ProductsClientViewComponent, canActivate: [AuthGuard], data: { roles: ['client'] } },
            { path: 'product-details-view', component: ProductClientDetailsComponent, canActivate: [AuthGuard], data: { roles: ['client'] } },
            { path: 'purchase-list', component: PurchaseClientViewComponent, canActivate: [AuthGuard], data: { roles: ['client'] } },
            { path: 'purchase-details/:purchaseId', component: PurchaseDetailsComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'client'] } },
            { path: 'dashboard-view', component: DashboardClientViewComponent, canActivate: [AuthGuard], data: { roles: ['client'] } },
            { path: 'notification-list', component: NotificationClientViewComponent, canActivate: [AuthGuard], data: { roles: ['client'] } }
        ]
    },
];
