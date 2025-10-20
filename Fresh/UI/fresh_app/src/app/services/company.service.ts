import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentUrlService } from './environment-url.service';
import { CompanyInfo } from '../model/CompanyInfo';
import { ClientInsertRequest } from '../model/requests/ClientInsertRequest';
import { CompanyRegistration } from '../model/requests/CompanyRegistration';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly endpoint: string = 'Company';

  private companyInfoSubject = new BehaviorSubject<CompanyInfo | null>(null);
  companyInfo$ = this.companyInfoSubject.asObservable();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  loadCompanyInformation(resource: string): void {
    this.http.get<CompanyInfo>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}`)
      .subscribe((data: CompanyInfo) => {
        this.companyInfoSubject.next(data);
      })
  }

  AddClientToCompany(resource: string, companyId: number, data: ClientInsertRequest): Observable<any> {
    return this.http.post(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, data);
  }

  DeleteClient(resource: string, clientId: number): Observable<any> {
    return this.http.delete(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${clientId}`);
  }

  RegisterCompany(resource: string, data: CompanyRegistration): Observable<any> {
    return this.http.post(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}`, data);
  }
}
