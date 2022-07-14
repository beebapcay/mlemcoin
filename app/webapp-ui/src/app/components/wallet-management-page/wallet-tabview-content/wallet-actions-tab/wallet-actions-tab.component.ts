import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TransactionPool } from '../../../../models/transaction-pool.model';
import { Transaction } from '../../../../models/transaction.model';
import { MinerService } from '../../../../services/miner.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TransactionPoolService } from '../../../../services/transaction-pool.service';
import { TransactionService } from '../../../../services/transaction.service';
import { UnspentTxOutService } from '../../../../services/unspent-tx-out.service';
import { WalletService } from '../../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../../subscription-aware.abstract.component';


@Component({
  selector: 'walletmgmt-wallet-actions-tab',
  templateUrl: './wallet-actions-tab.component.html',
  styleUrls: ['./wallet-actions-tab.component.scss']
})
export class WalletActionsTabComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  miningSelectedTxs: Transaction[] = [];

  constructor(public snackbarService: SnackbarService,
              public transactionService: TransactionService,
              public transactionPoolService: TransactionPoolService,
              public unspentTxOutService: UnspentTxOutService,
              public walletService: WalletService,
              public minerService: MinerService) {
    super();
  }

  ngOnInit(): void {
    this.fetching();
  }

  fetching(): void {
    this.registerSubscription(
      forkJoin([
        this.transactionPoolService.getTransactionPool(),
        this.unspentTxOutService.getUnspentTxOuts()
      ]).subscribe({
        next: ([transactionPool, unspentTxOuts]) => {
          this.transactionPoolService.transactionPool.next(transactionPool);
          this.unspentTxOutService.unspentTxOuts.next(unspentTxOuts);
        },
        error: (err) => {
          this.transactionPoolService.transactionPool.next(new TransactionPool({ transactions: [] }));
          this.unspentTxOutService.unspentTxOuts.next([]);
        }
      })
    );
  }

  beggarCreator(): void {
    if (!this.walletService.publicKey.value) {
      this.snackbarService.openErrorAnnouncement('Please, load your address first.');
      return;
    }

    this.transactionService.beggarCreator()
      .subscribe({
        next: (amount) => {
          this.snackbarService.openSuccessAnnouncement(`You have received ${amount} coins from the creator. Check in transaction pool`);
          this.walletService.change.next();
          this.fetching();
        },
        error: (err) => {
          this.snackbarService.openErrorAnnouncement('Sorry. Creator is not available at the moment or poor.');
        }
      });
  }

  beggarCoinbaseAward(): void {
    if (!this.walletService.publicKey.value) {
      this.snackbarService.openErrorAnnouncement('Please, load your address first.');
      return;
    }

    this.transactionService.beggarCoinbaseAward()
      .subscribe({
        next: () => {
          this.snackbarService.openSuccessAnnouncement('You have received a coinbase award form mining next block empty txs. Check in your wallet.');
          this.walletService.change.next();
        },
        error: (err) => {
          this.snackbarService.openErrorAnnouncement('Sorry. Your mining not completed yet or Something went wrong.');
        }
      });

  }

  mining(): void {
    if (!this.miningSelectedTxs || this.miningSelectedTxs.length === 0) {
      this.snackbarService.openErrorAnnouncement('Please, select transactions to mine.');
      return;
    }

    this.registerSubscription(
      this.minerService.mineTxs(this.miningSelectedTxs).subscribe({
        next: () => {
          this.snackbarService.openSuccessAnnouncement('Your mining is completed. You receive a coinbase award. Check in your wallet.');
          this.walletService.change.next();
          this.fetching();
        },
        error: (err) => {
          this.snackbarService.openErrorAnnouncement('Sorry. Your mining not completed yet or Something went wrong.');
          this.fetching();
        }
      })
    );
  }
}
