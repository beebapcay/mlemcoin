import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AppRouteConstant } from '../../../common/app-route.constant';
import { Transaction } from '../../../models/transaction.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { TransactionService } from '../../../services/transaction.service';
import { UnspentTxOutService } from '../../../services/unspent-tx-out.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';

@Component({
  selector: 'mlemscan-all-transactions-page',
  templateUrl: './all-transactions-page.component.html',
  styleUrls: ['./all-transactions-page.component.scss']
})
export class AllTransactionsPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  transactions: Transaction[] = [];

  breadcrumb: MenuItem[] = [{
    label: 'Detail All Transactions',
    routerLink: [AppRouteConstant.MLEMSCAN, AppRouteConstant.ALL_TRANSACTIONS]
  }];

  constructor(public transactionService: TransactionService,
              public unspentTxOutService: UnspentTxOutService,
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
        this.transactionService.getTransactions(),
        this.unspentTxOutService.getUnspentTxOuts()
      ]).subscribe({
        next: ([transaction, unspentTxOuts]) => {
          this.transactions = transaction;
          this.unspentTxOutService.unspentTxOuts.next(unspentTxOuts);
        },
        error: () => {
          this.transactions = [];
          this.unspentTxOutService.unspentTxOuts.next([]);
        }
      })
    );
  }

}
