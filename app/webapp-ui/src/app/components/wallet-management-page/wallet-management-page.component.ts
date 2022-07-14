import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { PersistenceService } from '../../services/persistence.service';
import { WalletService } from '../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';

@Component({
  selector: 'app-wallet-management-page',
  templateUrl: './wallet-management-page.component.html',
  styleUrls: ['./wallet-management-page.component.scss']
})
export class WalletManagementPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  breadcrumb: MenuItem[] = [{
    label: 'Wallet Management',
    routerLink: [AppRouteConstant.WALLET_MANAGEMENT]
  }];

  constructor(public breadcrumbService: BreadcrumbService,
              public walletService: WalletService,
              public persistenceService: PersistenceService) {
    super();
  }

  ngOnInit() {
    this.loadFromLocalStorage();

    this.registerSubscription(
      this.walletService.publicKey.subscribe((address) => {
        if (address) {
          this.persistenceService.set('address', address);
        } else {
          this.persistenceService.remove('address');
        }
      })
    );

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb(this.breadcrumb);
    }, 0);
  }

  loadFromLocalStorage() {
    const publicKey = JSON.parse(this.persistenceService.get('address'));
    if (publicKey) {
      this.walletService.publicKey.next(publicKey);
    }
  }

}
