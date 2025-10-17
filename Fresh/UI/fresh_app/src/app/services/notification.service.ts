import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { NotificationSearch } from '../model/search/NotificationSearch';
import { Notification } from '../model/Notification';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationInsertRequest } from '../model/requests/NotificationInsertRequest';
import { NotificationUpdateRequest } from '../model/requests/NotificationUpdateRequest';
import { PagedResult } from '../model/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly endpoint = 'Notification';

  private newNotificationCountSource = new BehaviorSubject<number>(0);
  newNotificationCount$ = this.newNotificationCountSource.asObservable();

  private notificationsSource = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  getAll(resource: string, companyId: number, search?: NotificationSearch): Observable<PagedResult<Notification>> {
    let params = new HttpParams();

    if (search?.page != null && search?.page != undefined) {
      params = params.set('page', search.page);
    }

    if (search?.pageSize != null && search?.pageSize != undefined) {
      params = params.set('PageSize', search.pageSize);
    }

    if (search?.isCompanyIncluded != null && search?.isCompanyIncluded != undefined) {
      params = params.set('isCompanyIncluded', search.isCompanyIncluded);
    }

    return this.http.get<PagedResult<Notification>>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, { params });
  }

  getById(companyId: number, notificationId: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/notifications/${notificationId}`);
  }

  insert(resource: string, companyId: number, data: NotificationInsertRequest): Observable<Notification> {
    return this.http.post<Notification>(`${this.envUrl.urlAddress}/${this.endpoint}/${resource}/${companyId}`, data);
  }

  update(companyId: number, notificationId: number, data: NotificationUpdateRequest): Observable<Notification> {
    return this.http.put<Notification>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/notifications/${notificationId}`, data);
  }

  delete(companyId: number, notificationId: number): Observable<Notification> {
    return this.http.delete<Notification>(`${this.envUrl.urlAddress}/${this.endpoint}/companies/${companyId}/notifications/${notificationId}`);
  }

  setAllNotifications(notifications: Notification[]) {
    this.notificationsSource.next(notifications);
  }

  addedNotification(notification: Notification) {
    const current = this.notificationsSource.value;
    this.notificationsSource.next([...current, notification]);
  }

  updatedNotification(notification: Notification) {
    const updated = this.notificationsSource.value.map(n =>
      n.id === notification.id ? notification : n
    );
    this.notificationsSource.next(updated);
  }

  deletedNotification(notification: Notification) {
    const filtered = this.notificationsSource.value.filter(n => n.id !== notification.id);
    this.notificationsSource.next(filtered);
  }

  increaseCount() {
    const current = this.newNotificationCountSource.value;
    this.newNotificationCountSource.next(current + 1);
  }

  resetCount() {
    this.newNotificationCountSource.next(0);
  }
}
