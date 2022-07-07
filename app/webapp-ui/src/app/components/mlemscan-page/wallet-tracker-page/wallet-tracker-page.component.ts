import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { Wallet } from '../../../models/wallet.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { WalletService } from '../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';

@Component({
  selector: 'app-wallet-tracker-page',
  templateUrl: './wallet-tracker-page.component.html',
  styleUrls: ['./wallet-tracker-page.component.scss']
})
export class WalletTrackerPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  wallets: Wallet[] = [];

  breadcrumb: MenuItem[] = [{
    label: 'Wallet Tracker',
    routerLink: [AppRouteConstant.MLEMSCAN, AppRouteConstant.WALLET_TRACKER]
  }];

  constructor(private breadcrumbService: BreadcrumbService,
              private mlemscanPage: MlemscanPageComponent,
              private walletService: WalletService) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      this.walletService.getTracker().subscribe(wallets => {
        this.wallets = wallets || [];
      })
    );

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
    }, 0);
  }

}
