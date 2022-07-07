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
}
