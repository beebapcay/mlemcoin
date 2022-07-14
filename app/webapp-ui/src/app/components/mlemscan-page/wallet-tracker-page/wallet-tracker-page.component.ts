import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { AppSrcAssetsConstant } from '../../../common/app-src-assets.constant';
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
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;

  wallets: Wallet[] = [];

  dataSourceFiltered: Wallet[] = [];

  @ViewChild('addressSearch') addressSearchRef: ElementRef;

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
    this.fetching();

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
    }, 0);
  }

  search() {
    const address = this.addressSearchRef.nativeElement.value || '';
    console.log('searching for address:', address);

    this.dataSourceFiltered = this.wallets.filter(wallet => (
      wallet.address.toLowerCase().includes(address.toLowerCase())
    ));
  }

  fetching() {
    this.registerSubscription(
      this.walletService.getTracker().subscribe({
        next: (wallets) => {
          this.wallets = wallets || [];
          this.dataSourceFiltered = this.wallets;
          this.search();
        },
        error: (err) => {
          this.wallets = [];
          this.dataSourceFiltered = [];
        }
      })
    );
  }
}
