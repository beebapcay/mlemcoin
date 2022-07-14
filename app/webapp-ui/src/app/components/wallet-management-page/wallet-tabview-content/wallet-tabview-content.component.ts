import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-tabview-content',
  templateUrl: './wallet-tabview-content.component.html',
  styleUrls: ['./wallet-tabview-content.component.scss']
})
export class WalletTabviewContentComponent extends SubscriptionAwareAbstractComponent implements OnInit {

  constructor(public walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
  }
}
