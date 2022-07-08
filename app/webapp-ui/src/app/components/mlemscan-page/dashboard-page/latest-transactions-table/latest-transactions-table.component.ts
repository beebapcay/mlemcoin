import { Component, Input, OnInit } from '@angular/core';
import { AppSrcAssetsConstant } from '../../../../common/app-src-assets.constant';
import { Transaction } from '../../../../models/transaction.model';
import { UnspentTxOut } from '../../../../models/unspent-tx-out.model';
import { TransactionUtil } from '../../../../utils/transaction.util';

@Component({
  selector: 'mlemscan-dashboard-latest-transactions-table',
  templateUrl: './latest-transactions-table.component.html',
  styleUrls: ['./latest-transactions-table.component.scss']
})
export class LatestTransactionsTableComponent implements OnInit {
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;

  @Input() transactions: Transaction[] = [];
  @Input() unspentTxOuts: UnspentTxOut[] = [];

  TransactionUtil = TransactionUtil;

  constructor() {
  }

  ngOnInit(): void {
  }
}
