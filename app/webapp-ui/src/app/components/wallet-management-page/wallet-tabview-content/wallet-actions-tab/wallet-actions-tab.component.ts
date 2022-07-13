import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../../services/snackbar.service';
import { TransactionService } from '../../../../services/transaction.service';
import { WalletService } from '../../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-actions-tab',
  templateUrl: './wallet-actions-tab.component.html',
  styleUrls: ['./wallet-actions-tab.component.scss']
})
export class WalletActionsTabComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  constructor(public snackbarService: SnackbarService,
              public transactionService: TransactionService,
              public walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
  }

  beggarCreator(): void {
    if (!this.walletService.privateKey) {
      this.snackbarService.openErrorAnnouncement('Please, load your private key first.');
      return;
    }
    this.registerSubscription(
      this.transactionService.beggarCreator()
        .subscribe({
          next: (amount) => {
            this.snackbarService.openSuccessAnnouncement(`You have received ${amount} coins from the creator. Check in transaction pool`);
          },
          error: (err) => {
            this.snackbarService.openErrorAnnouncement('Sorry. Creator is not available at the moment or poor.');
          }
        })
    );
  }

  beggarCoinbaseAward(): void {
    if (!this.walletService.privateKey) {
      this.snackbarService.openErrorAnnouncement('Please, load your private key first.');
      return;
    }
    this.registerSubscription(
      this.transactionService.beggarCoinbaseAward()
        .subscribe({
          next: () => {
            this.snackbarService.openSuccessAnnouncement('You have received a coinbase award form mining next block empty txs. Check in your wallet.');
          },
          error: (err) => {
            this.snackbarService.openErrorAnnouncement('Sorry. Your mining not completed yet or Something went wrong.');
          }
        })
    );
  }

}
