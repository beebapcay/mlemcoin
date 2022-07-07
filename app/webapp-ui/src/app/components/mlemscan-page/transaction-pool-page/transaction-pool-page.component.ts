import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { zip } from 'rxjs';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { TransactionPool } from '../../../models/transaction-pool.model';
import { UnspentTxOut } from '../../../models/unspent-tx-out.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { TransactionPoolService } from '../../../services/transaction-pool.service';
import { UnspentTxOutService } from '../../../services/unspent-tx-out.service';
import { TransactionUtil } from '../../../utils/transaction.util';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';


@Component({
  selector: 'mlemscan-transaction-pool-page',
  templateUrl: './transaction-pool-page.component.html',
  styleUrls: ['./transaction-pool-page.component.scss']
})
export class TransactionPoolPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  transactionPool: TransactionPool;
  unspentTxOuts: UnspentTxOut[] = [];

  TransactionUtil = TransactionUtil;

  breadcrumb: MenuItem[] = [{
    label: 'Transaction Pool',
    routerLink: [AppRouteConstant.MLEMSCAN, AppRouteConstant.TX_POOL]
  }];


  constructor(public transactionPoolService: TransactionPoolService,
              public unspentTxOutService: UnspentTxOutService,
              public breadcrumbService: BreadcrumbService,
              public mlemscanPage: MlemscanPageComponent) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      zip(
        this.transactionPoolService.getTransactionPool(),
        this.unspentTxOutService.getUnspentTxOuts()
      ).subscribe(([transactionPool, unspentTxOuts]) => {
        this.transactionPool = transactionPool;
        this.unspentTxOuts = unspentTxOuts;
      })
    );

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
    }, 0);
  }
}
