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
  privateKey: string;

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
    this.loadPublicKeyAndPrivateKeyFromLocalStorage();

    this.registerSubscription(
      this.walletService.privateKey.subscribe(() => {
        this.privateKey = this.walletService.privateKey.getValue();

        this.persistenceService.set('privateKey', this.privateKey);

        if (this.privateKey && this.privateKey.length > 0) {
          this.registerSubscription(
            this.walletService.getAddress().subscribe({
              next: publicKey => {
                this.persistenceService.set('publicKey', publicKey);
                this.walletService.publicKey.next(publicKey);
              },
              error: error => {
                this.walletService.publicKey.next(null);
                this.walletService.privateKey.next(null);
              }
            })
          );
        } else {
          this.walletService.publicKey.next(null);
          this.persistenceService.remove('publicKey');
          this.persistenceService.remove('privateKey');
        }
      })
    );

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb(this.breadcrumb);
    }, 0);
  }

  loadPublicKeyAndPrivateKeyFromLocalStorage() {
    const privateKey = JSON.parse(this.persistenceService.get('privateKey'));
    this.walletService.privateKey.next(privateKey);

    const publicKey = JSON.parse(this.persistenceService.get('publicKey'));
    this.walletService.publicKey.next(publicKey);
  }
}
