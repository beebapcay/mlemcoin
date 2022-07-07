import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { zip } from 'rxjs';
import { AppRouteConstant } from '../../common/app-route.constant';
import { Block } from '../../models/block.model';
import { Blockchain } from '../../models/blockchain.model';
import { Transaction } from '../../models/transaction.model';
import { UnspentTxOut } from '../../models/unspent-tx-out.model';
import { BlockchainService } from '../../services/blockchain.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TransactionService } from '../../services/transaction.service';
import { UnspentTxOutService } from '../../services/unspent-tx-out.service';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';

@Component({
  selector: 'app-mlemscan-page',
  templateUrl: './mlemscan-page.component.html',
  styleUrls: ['./mlemscan-page.component.scss']
})
export class MlemscanPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  blockchain: Blockchain;

  latestBlocks: Block[] = [];
  latestTransactions: Transaction[] = [];
  unspentTxOuts: UnspentTxOut[] = [];

  constructor(public router: Router,
              public blockchainService: BlockchainService,
              public unspentTxOutService: UnspentTxOutService,
              public transactionService: TransactionService,
              public snackbarService: SnackbarService,
              public breadcrumbService: BreadcrumbService) {
    super();
  }

  ngOnInit(): void {
    this.fetching();

    this.breadcrumbService.resetHome();
    this.breadcrumbService.addBreadcrumb({
      label: 'Mlemscan Dashboard',
      url: AppRouteConstant.MLEMSCAN
    });
  }

  fetching() {
    this.registerSubscription(
      zip(
        this.blockchainService.getBlockchain(),
        this.transactionService.getTransactions(),
        this.unspentTxOutService.getUnspentTxOuts()
      ).subscribe(([blockchain, transactions, unspentTxOuts]) => {
        this.blockchain = blockchain;
        this.latestBlocks = blockchain.chain;
        this.latestTransactions = transactions;
        this.unspentTxOuts = unspentTxOuts;
      })
    );
  }
}
