import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';
import { BreadcrumbService } from '../../services/breadcrumb.service';
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

  constructor(public breadcrumbService: BreadcrumbService) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb(this.breadcrumb);
    }, 0);
  }
}
