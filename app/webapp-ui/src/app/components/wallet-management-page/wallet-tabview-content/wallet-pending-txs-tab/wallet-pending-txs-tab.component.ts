import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Transaction } from '../../../../models/transaction.model';
import { UnspentTxOut } from '../../../../models/unspent-tx-out.model';
import { TransactionService } from '../../../../services/transaction.service';
import { UnspentTxOutService } from '../../../../services/unspent-tx-out.service';
import { WalletService } from '../../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-pending-txs-tab',
  templateUrl: './wallet-pending-txs-tab.component.html',
  styleUrls: ['./wallet-pending-txs-tab.component.scss']
})
export class WalletPendingTxsTabComponent extends SubscriptionAwareAbstractComponent implements OnInit {
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
            this.transactionService.getPendingTxsByAddress(publicKey),
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
