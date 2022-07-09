import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { Block } from '../../../models/block.model';
import { Blockchain } from '../../../models/blockchain.model';
import { Transaction } from '../../../models/transaction.model';
import { UnspentTxOut } from '../../../models/unspent-tx-out.model';
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

  blockchain: Blockchain;

  latestBlocks: Block[] = [];
  latestTransactions: Transaction[] = [];

  unspentTxOuts: UnspentTxOut[] = [];

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
          this.blockchain = blockchain;
          this.latestBlocks = blockchain.chain.sort((a, b) => b.index - a.index);
          this.latestTransactions = transactions.reverse();
          this.unspentTxOuts = unspentTxOuts;
        },
        error: () => {
          this.blockchain = new Blockchain({ chain: [] });
          this.latestBlocks = [];
          this.latestTransactions = [];
          this.unspentTxOuts = [];
        }
      })
    );
  }
}
