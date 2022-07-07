import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { UnspentTxOut } from '../../../models/unspent-tx-out.model';
import { TransactionUtil } from '../../../utils/transaction.util';

@Component({
  selector: 'mlemscan-latest-transactions-table',
  templateUrl: './latest-transactions-table.component.html',
  styleUrls: ['./latest-transactions-table.component.scss']
})
export class LatestTransactionsTableComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Input() unspentTxOuts: UnspentTxOut[] = [];

  TransactionUtil = TransactionUtil;

  constructor() {
  }

  ngOnInit(): void {
  }
}
