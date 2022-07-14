import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnspentTxOut } from '../models/unspent-tx-out.model';

@Injectable({
  providedIn: 'root'
})
export class UnspentTxOutService {
  public static readonly API_URL = '/api/unspent-tx-outs';

  unspentTxOuts: BehaviorSubject<UnspentTxOut[]> = new BehaviorSubject<UnspentTxOut[]>(null);

  constructor(private http: HttpClient) {
  }

  getUnspentTxOuts(): Observable<UnspentTxOut[]> {
    const url = UnspentTxOutService.API_URL;
    return this.http.get<UnspentTxOut[]>(url);
  }
}
