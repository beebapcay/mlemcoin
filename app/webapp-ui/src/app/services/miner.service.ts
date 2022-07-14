import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class MinerService {
  static readonly API_URL = '/api/miner';

  constructor(public http: HttpClient) {
  }

  mineTxs(txs: Transaction[]): Observable<void> {
    const url = MinerService.API_URL + '/mine-txs';
    return this.http.post<void>(url, { txs });
  }

}
