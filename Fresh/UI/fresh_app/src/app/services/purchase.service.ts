import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Purchase } from '../model/Purchase';
import { firstValueFrom, Observable } from 'rxjs';
import { PurchaseSearch } from '../model/search/PurchaseSearch';
import { Clients } from '../model/Clients';
import { PurchaseInsertRequest } from '../model/requests/PurchaseInsertRequest';
import { ProductUpdateRequest } from '../model/requests/ProductUpdateRequest';
import { PurchasesClientDto } from '../model/PurchasesClientDto';
import { PurchaseUpdateRequest } from '../model/requests/PurchaseUpdateRequest';
import { ClientsPurchasesSearch } from '../model/search/ClientsPurchasesSearch';
import { PagedResult } from '../model/PagedResult';
import { ClientPurchasesInfo } from '../model/ClientPurchasesInfo';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly endpoint = 'Purchase';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getAll(resource: string, companyId: number, search?: PurchaseSearch): Observable<Purchase[]> {
    let params = new HttpParams();

    if (search?.isProductIncluded != null && search?.isProductIncluded != undefined) {
      params = params.set('isProductIncluded', search.isProductIncluded);
    }

    if (search?.isClientIncluded != null && search?.isClientIncluded != undefined) {
      params = params.set('isClientIncluded', search.isClientIncluded);
    }

    if (search?.isPaymentsIncluded != null && search?.isPaymentsIncluded != undefined) {
      params = params.set('isPaymentsIncluded', search.isPaymentsIncluded);
    }

    return this.http.get<Purchase[]>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { params });
  }

  getById(companyId: number, purchaseId: number, search?: PurchaseSearch): Observable<Purchase> {
    let params = new HttpParams();

    if (search?.isProductIncluded != null && search?.isProductIncluded != undefined) {
      params = params.set('isProductIncluded', search.isProductIncluded);
    }

    if (search?.isClientIncluded != null && search?.isClientIncluded != undefined) {
      params = params.set('isClientIncluded', search.isClientIncluded);
    }

    if (search?.isPaymentsIncluded != null && search?.isPaymentsIncluded != undefined) {
      params = params.set('isPaymentsIncluded', search.isPaymentsIncluded);
    }

    return this.http.get<Purchase>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/purchases/${purchaseId}`, { params });
  }

  GetClientsByPurchases(resource: string, companyId: number, search?: ClientsPurchasesSearch): Observable<PagedResult<PurchasesClientDto>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.firstNameAndLastName && search?.firstNameAndLastName != undefined) {
      params = params.set('firstNameAndLastName', search.firstNameAndLastName);
    }

    return this.http.get<PagedResult<PurchasesClientDto>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { params });
  }

  GetClientPurchasesInfo(resource: string, companyId: number, search?: PurchaseSearch): Observable<PagedResult<ClientPurchasesInfo>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.productType && search?.productType != undefined) {
      params = params.set('productType', search.productType);
    }

    if (search?.dateFrom != null && search?.dateFrom != undefined) {
      params = params.set('dateFrom', search.dateFrom.toDateString());
    }

    if (search?.dateTo != null && search?.dateTo != undefined) {
      params = params.set('dateTo', search.dateTo.toDateString());
    }

    return this.http.get<PagedResult<ClientPurchasesInfo>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { params });
  }

  GetPurchasesByClientId(companyId: number, clientId: number, search?: PurchaseSearch): Observable<PagedResult<Purchase>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.productType && search?.productType != undefined) {
      params = params.set('productType', search.productType);
    }

    if (search?.dateFrom != null && search?.dateFrom != undefined) {
      params = params.set('dateFrom', search.dateFrom.toDateString());
    }

    if (search?.dateTo != null && search?.dateTo != undefined) {
      params = params.set('dateTo', search.dateTo.toDateString());
    }

    return this.http.get<PagedResult<Purchase>>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/clients/${clientId}`, { params });
  }

  insert(resource: string, companyId: number, data: PurchaseInsertRequest): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, data);
  }

  update(companyId: number, purchaseId: number, data: PurchaseUpdateRequest): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/purchases/${purchaseId}`, data);
  }

  delete(companyId: number, purchaseId: number): Observable<Purchase> {
    return this.http.delete<Purchase>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/purchases/${purchaseId}`);
  }

  getAllPurchasesCsv(resource: string, companyId: number) {
    return this.http.get(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { responseType: 'blob' });
  }

  printPdf(resource: string, companyId: number, purchaseId: number) {
    return this.http.get(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}/${purchaseId}`, { responseType: 'blob' });
  }
}
