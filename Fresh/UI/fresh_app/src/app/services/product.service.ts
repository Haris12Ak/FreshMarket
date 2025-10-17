import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable } from 'rxjs';
import { Products } from '../model/Products';
import { ProductInsertRequest } from '../model/requests/ProductInsertRequest';
import { ProductUpdateRequest } from '../model/requests/ProductUpdateRequest';
import { ProductSearch } from '../model/search/ProductSearch';
import { PagedResult } from '../model/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = 'Product';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getById(resource: string, productId: number): Observable<Products> {
    return this.http.get<Products>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`);
  }

  getProductsByCompanyId(resource: string, companyId: number, search?: ProductSearch): Observable<PagedResult<Products>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.name) {
      params = params.set('name', search.name);
    }

    if (search?.productType) {
      params = params.set('productType', search.productType);
    }

    if (search?.isActive != null && search?.isActive != undefined) {
      params = params.set('isActive', search.isActive);
    }

    return this.http.get<PagedResult<Products>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { params });
  }

  insert(resource: string, companyId: number, data: ProductInsertRequest): Observable<Products> {
    return this.http.post<Products>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, data);
  }

  update(resource: string, productId: number, data: ProductUpdateRequest): Observable<Products> {
    return this.http.put<Products>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`, data);
  }

  delete(resource: string, productId: number): Observable<Products> {
    return this.http.delete<Products>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`);
  }
}
