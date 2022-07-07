import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionPool } from '../models/transaction-pool.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionPoolService {
  static readonly API_URL = '/api/transaction-pool';

  constructor(public http: HttpClient) {
  }

  getTransactionPool(): Observable<TransactionPool> {
    const url = TransactionPoolService.API_URL;
    return this.http.get<TransactionPool>(url);
  }
}
