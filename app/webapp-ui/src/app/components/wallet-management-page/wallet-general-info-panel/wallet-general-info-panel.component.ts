import { Component, OnInit } from '@angular/core';
import { Wallet } from '../../../models/wallet.model';
import { WalletService } from '../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-general-info-panel',
  templateUrl: './wallet-general-info-panel.component.html',
  styleUrls: ['./wallet-general-info-panel.component.scss']
})
export class WalletGeneralInfoPanelComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  wallet: Wallet;

  constructor(public walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      this.walletService.publicKey.subscribe(() => {
        if (this.walletService.publicKey.value) {
          this.registerSubscription(
            this.walletService.getMyWalletDetails().subscribe({
              next: wallet => {
                this.wallet = wallet;
              },
              error: err => {
                this.wallet = null;
              }
            })
          );
        }
      })
    );
  }

}
