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
}
