import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  static readonly API_URL = '/api/transactions';

  constructor(private http: HttpClient) {
  }

  getTransactions(): Observable<Transaction[]> {
    const url = TransactionService.API_URL;
    return this.http.get<Transaction[]>(url);
  }

  getTransactionById(id: string): Observable<Transaction> {
    const url = TransactionService.API_URL + '/' + id;
    return this.http.get<Transaction>(url);
  }

  getSuccessTxsByAddress(address: string): Observable<Transaction[]> {
    const url = TransactionService.API_URL + '/' + address + '/success';
    return this.http.get<Transaction[]>(url);
  }

  getPendingTxsByAddress(address: string): Observable<Transaction[]> {
    const url = TransactionService.API_URL + '/' + address + '/pending';
    return this.http.get<Transaction[]>(url);
  }

  sendCoin(address: string, amount: number): Observable<void> {
    const url = TransactionService.API_URL + '/send';
    return this.http.post<void>(url, { address, amount });
  }

  beggarCreator(): Observable<number> {
    const url = TransactionService.API_URL + '/beggar-creator';
    return this.http.get<number>(url);
  }

  beggarCoinbaseAward(): Observable<void> {
    const url = TransactionService.API_URL + '/beggar-coinbase-award';
    return this.http.get<void>(url);
  }
}
