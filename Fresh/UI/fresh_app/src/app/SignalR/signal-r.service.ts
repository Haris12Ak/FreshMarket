import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { EnvironmentUrlService } from '../services/environment-url.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Notification } from '../model/Notification';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  hubConnection!: signalR.HubConnection;

  constructor(private envUrl: EnvironmentUrlService) { }

  public startConnection(companyId: string): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.envUrl.urlAddress}/notificationHub?companyId=${companyId}`, {
        withCredentials: true
      })// URL of the SignalR hub
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch(err => console.log('Error establishing SignalR connection: ' + err));
  }
}
