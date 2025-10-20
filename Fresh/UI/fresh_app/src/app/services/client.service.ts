import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Clients } from '../model/Clients';
import { Observable } from 'rxjs';
import { ClientSearch } from '../model/search/ClientSearch';
import { PagedResult } from '../model/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly endpoint: string = 'Clients';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getClientsByCompany(resource: string, search?: ClientSearch): Observable<PagedResult<Clients>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.firstName) {
      params = params.set('firstName', search.firstName);
    }

    if (search?.lastName) {
      params = params.set('lastName', search.lastName);
    }

    return this.http.get<PagedResult<Clients>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}`, { params });
  }

  GetClientInfo(): Observable<Clients> {
    return this.http.get<Clients>(`${this.envUrl.urlAddress}/${this.endpoint}/client-info`);
  }

  deactivate(clientId: number, companyId: number, isActive: boolean): Observable<Clients> {
    return this.http.put<Clients>(`${this.envUrl.urlAddress}/${this.endpoint}/deactivate/${companyId}/client/${clientId}`, isActive);
  }
}


