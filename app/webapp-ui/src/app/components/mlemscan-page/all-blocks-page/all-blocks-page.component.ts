import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { Blockchain } from '../../../models/blockchain.model';
import { BlockchainService } from '../../../services/blockchain.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';

@Component({
  selector: 'mlemscan-all-blocks-page',
  templateUrl: './all-blocks-page.component.html',
  styleUrls: ['./all-blocks-page.component.scss']
})
export class AllBlocksPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  breadcrumb: MenuItem[] = [{
    label: 'Detail All Blocks',
    routerLink: [AppRouteConstant.MLEMSCAN, AppRouteConstant.ALL_TRANSACTIONS]
  }];

  constructor(public blockchainService: BlockchainService,
              public breadcrumbService: BreadcrumbService,
              public mlemscanPage: MlemscanPageComponent) {
    super();
  }

  ngOnInit(): void {
    this.fetching();

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
    }, 0);
  }

  fetching() {
    this.registerSubscription(
      this.blockchainService.getBlockchain().subscribe({
        next: (blockchain) => {
          blockchain.chain = blockchain.chain.sort((a, b) => b.index - a.index);

          this.blockchainService.blockchain.next(blockchain);
        },
        error: () => {
          this.blockchainService.blockchain.next(new Blockchain({ chain: [] }));
        }
      })
    );
  }

}
