import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable } from 'rxjs';
import { AdminDashboardDto } from '../model/AdminDashboardDto';
import { HttpClient } from '@angular/common/http';
import { ClientDashboardDto } from '../model/ClientDashboardDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly endpoint = 'Dashboard';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  
  adminDashboardView(resource: string, companyId: number): Observable<AdminDashboardDto>{
    return this.http.get<AdminDashboardDto>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`);
  }

  clientDashboardView(resource: string, companyId: number): Observable<ClientDashboardDto>{
    return this.http.get<ClientDashboardDto>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`);
  }
}
