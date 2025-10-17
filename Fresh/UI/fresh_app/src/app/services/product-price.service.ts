import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { ProductPrice } from '../model/ProductPrice';
import { Observable } from 'rxjs';
import { ProductPriceInsertRequest } from '../model/requests/ProductPriceInsertRequest';
import { ProductPriceUpdateRequest } from '../model/requests/ProductPriceUpdateRequest';
import { ProductPriceSearch } from '../model/search/ProductPriceSearch';
import { PagedResult } from '../model/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class ProductPriceService {

  private readonly endpoint = 'ProductPrice';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getByProductId(resource: string, productId: number, search?: ProductPriceSearch): Observable<PagedResult<ProductPrice>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.date != null && search?.date != undefined) {
      params = params.set('date', search.date.toDateString());
    }

    return this.http.get<PagedResult<ProductPrice>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`, { params });
  }

  insert(resource: string, productId: number, data: ProductPriceInsertRequest): Observable<ProductPrice> {
    return this.http.post<ProductPrice>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`, data);
  }

  update(resource: string, productId: number, data: ProductPriceUpdateRequest): Observable<ProductPrice> {
    return this.http.put<ProductPrice>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productId}`, data);
  }

  delete(resource: string, productPriceId: number): Observable<ProductPrice> {
    return this.http.delete<ProductPrice>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productPriceId}`);
  }
}
