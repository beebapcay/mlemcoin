import { Component, OnInit } from '@angular/core';
import { Wallet } from '../../../models/wallet.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { WalletService } from '../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-general-info-panel',
  templateUrl: './wallet-general-info-panel.component.html',
  styleUrls: ['./wallet-general-info-panel.component.scss']
})
export class WalletGeneralInfoPanelComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  wallet: Wallet;

  constructor(public walletService: WalletService,
              public snackbarService: SnackbarService) {
    super();
  }

  ngOnInit(): void {
    this.fetching();
  }

  fetching() {
    this.registerSubscription(
      this.walletService.publicKey.subscribe(publicKey => {
        if (publicKey) {
          this.walletService.getMyWalletDetails().subscribe({
            next: (wallet) => {
              this.wallet = wallet;
            },
            error: (error) => {
              // pass
            }
          });
        }
      })
    );
  }
}
