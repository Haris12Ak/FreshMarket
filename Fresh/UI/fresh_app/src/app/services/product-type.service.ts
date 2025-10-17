import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { ProductType } from '../model/ProductType';
import { Observable } from 'rxjs';
import { ProductTypeInsertRequest } from '../model/requests/ProductTypeInsertRequest';
import { ProductTypeUpdateRequest } from '../model/requests/ProductTypeUpdateRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private readonly endpoint = 'ProductType';

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getAll(resource: string): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}`);
  }

  getById(resource: string, productTypeId: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productTypeId}`);
  }

  insert(resource: string, data: ProductTypeInsertRequest): Observable<ProductType> {
    return this.http.post<ProductType>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}`, data);
  }

  update(resource: string, productTypeId: number, data: ProductTypeUpdateRequest): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productTypeId}`, data);
  }

  delete(resource: string, productTypeId: number): Observable<ProductType> {
    return this.http.delete<ProductType>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${productTypeId}`);
  }
}
