import { Component, OnInit } from '@angular/core';
import { MenuItem, SortEvent } from 'primeng/api';
import { forkJoin } from 'rxjs';
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
      forkJoin([
        this.transactionPoolService.getTransactionPool(),
        this.unspentTxOutService.getUnspentTxOuts()
      ]).subscribe({
        next: ([transactionPool, unspentTxOuts]) => {
          this.transactionPool = transactionPool;
          this.unspentTxOuts = unspentTxOuts;
        },
        error: () => {
          this.transactionPool = new TransactionPool({ transactions: [] });
          this.unspentTxOuts = [];
        }
      })
    );

    setTimeout(() => {
      this.breadcrumbService.initBreadcrumb([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
    }, 0);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const field = event.field;

      let value1;
      let value2;

      switch (field) {
        case 'id':
          value1 = data1.id;
          value2 = data2.id;
          break;
        case 'signature':
          value1 = data1.txIns[0].signature;
          value2 = data2.txIns[0].signature;
          break;
        case 'sender':
          value1 = TransactionUtil.getSenderAddress(data1, this.unspentTxOuts);
          value2 = TransactionUtil.getSenderAddress(data2, this.unspentTxOuts);
          break;
        case 'receiver':
          value1 = TransactionUtil.getReceiverAddress(data1);
          value2 = TransactionUtil.getReceiverAddress(data2);
          break;
        case 'type':
          value1 = TransactionUtil.getTransactionType(data1, this.unspentTxOuts);
          value2 = TransactionUtil.getTransactionType(data2, this.unspentTxOuts);
          break;
        case 'total':
          value1 = TransactionUtil.getTotalAmount(data1);
          value2 = TransactionUtil.getTotalAmount(data2);
          break;
        case 'send-to':
          value1 = TransactionUtil.getSendToAmount(data1);
          value2 = TransactionUtil.getSendToAmount(data2);
          break;
        case 'send-back':
          value1 = TransactionUtil.getSendBackAmount(data1);
          value2 = TransactionUtil.getSendBackAmount(data2);
          break;
      }

      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }
}
