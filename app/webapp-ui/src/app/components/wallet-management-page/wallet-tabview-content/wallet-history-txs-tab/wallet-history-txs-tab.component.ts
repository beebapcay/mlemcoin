import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Transaction } from '../../../../models/transaction.model';
import { UnspentTxOut } from '../../../../models/unspent-tx-out.model';
import { TransactionService } from '../../../../services/transaction.service';
import { UnspentTxOutService } from '../../../../services/unspent-tx-out.service';
import { WalletService } from '../../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-history-txs-tab',
  templateUrl: './wallet-history-txs-tab.component.html',
  styleUrls: ['./wallet-history-txs-tab.component.scss']
})
export class WalletHistoryTxsTabComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  transactions: Transaction[] = [];
  unspentTxOuts: UnspentTxOut[] = [];

  constructor(public walletService: WalletService,
              public transactionService: TransactionService,
              public unspentTxOutService: UnspentTxOutService) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      this.walletService.publicKey.subscribe(publicKey => {
        this.registerSubscription(
          forkJoin([
            this.transactionService.getSuccessTxsByAddress(publicKey),
            this.unspentTxOutService.getUnspentTxOuts()
          ]).subscribe({
            next: ([transaction, unspentTxOuts]) => {
              this.transactions = transaction;
              this.unspentTxOuts = unspentTxOuts;
            },
            error: () => {
              this.transactions = [];
              this.unspentTxOuts = [];
            }
          })
        );
      })
    );
  }

}
