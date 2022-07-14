import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { Block } from '../../../models/block.model';
import { Blockchain } from '../../../models/blockchain.model';
import { Transaction } from '../../../models/transaction.model';
import { BlockchainService } from '../../../services/blockchain.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { TransactionService } from '../../../services/transaction.service';
import { UnspentTxOutService } from '../../../services/unspent-tx-out.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';

@Component({
  selector: 'mlemscan-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  readonly AppRouteConstant = AppRouteConstant;

  latestBlocks: Block[] = [];
  latestTransactions: Transaction[] = [];

  breadcrumb: MenuItem[] = [];

  constructor(public router: Router,
              public blockchainService: BlockchainService,
              public unspentTxOutService: UnspentTxOutService,
              public transactionService: TransactionService,
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
      forkJoin([
        this.blockchainService.getBlockchain(),
        this.transactionService.getTransactions(),
        this.unspentTxOutService.getUnspentTxOuts()
      ]).subscribe({
        next: ([blockchain, transactions, unspentTxOuts]) => {
          blockchain.chain = blockchain.chain.sort((a, b) => b.index - a.index);

          this.blockchainService.blockchain.next(blockchain);
          this.unspentTxOutService.unspentTxOuts.next(unspentTxOuts);

          this.latestBlocks = this.blockchainService.blockchain.value.chain.slice(0, 25);
          this.latestTransactions = transactions.reverse().slice(0, 25);
        },
        error: () => {
          this.blockchainService.blockchain.next(new Blockchain({ chain: [] }));
          this.unspentTxOutService.unspentTxOuts.next([]);

          this.latestBlocks = [];
          this.latestTransactions = [];
        }
      })
    );
  }
}
