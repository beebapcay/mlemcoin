import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Block } from '../models/block.model';
import { Blockchain } from '../models/blockchain.model';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  static readonly API_URL = '/blockchain';

  constructor(private http: HttpClient) {
  }

  getBlockchain(): Observable<Blockchain> {
    const url = BlockchainService.API_URL + '/blocks';
    return this.http.get<Blockchain>(url);
  }

  getBlockByHash(hash: string): Observable<Block> {
    const url = BlockchainService.API_URL + '/blocks/' + hash;
    return this.http.get<Block>(url);
  }
}

