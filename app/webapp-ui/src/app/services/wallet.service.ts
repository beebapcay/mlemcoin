import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wallet } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  public static readonly API_URL = '/api/wallet';

  constructor(private http: HttpClient) {
  }

  getTracker(): Observable<Wallet[]> {
    const url = WalletService.API_URL + '/tracker';
    return this.http.get<Wallet[]>(url);
  }

  generatePrivateKey(): Observable<string> {
    const url = WalletService.API_URL + '/generate-private-key';
    return this.http.get<string>(url);
  }

  connect(privateKey: string): Observable<void> {
    const url = WalletService.API_URL + '/connect';
    return this.http.post<void>(url, { privateKey });
  }

  disconnect(): Observable<void> {
    const url = WalletService.API_URL + '/disconnect';
    return this.http.delete<void>(url);
  }
}
