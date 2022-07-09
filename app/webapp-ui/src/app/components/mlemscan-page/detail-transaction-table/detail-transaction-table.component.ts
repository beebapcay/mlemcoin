import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { AppSrcAssetsConstant } from '../../../common/app-src-assets.constant';
import { Transaction } from '../../../models/transaction.model';
import { UnspentTxOut } from '../../../models/unspent-tx-out.model';
import { ArrayUtil } from '../../../utils/array.util';
import { TransactionUtil } from '../../../utils/transaction.util';

@Component({
  selector: 'mlemscan-detail-transaction-table',
  templateUrl: './detail-transaction-table.component.html',
  styleUrls: ['./detail-transaction-table.component.scss']
})
export class DetailTransactionTableComponent implements OnChanges {
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;
  readonly TransactionUtil = TransactionUtil;

  @Input() caption: string = 'Detail Transaction';
  @Input() transactions: Transaction[] = [];
  @Input() unspentTxOuts: UnspentTxOut[] = [];

  dataSourceFiltered: Transaction[] = [];

  @ViewChild('senderSearch') senderSearchRef: ElementRef;
  @ViewChild('receiverSearch') receiverSearchRef: ElementRef;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const txPrevious = changes['transactions'].previousValue;
    const txCurrent = changes['transactions'].currentValue;

    const compareRes = !txPrevious
      || !txCurrent
      || ArrayUtil.equals(txPrevious, txCurrent, (tx1: Transaction, tx2: Transaction) => (
        tx1.id.localeCompare(tx2.id)
      ));

    if (!compareRes) {
      this.transactions = changes['transactions'].currentValue ?? [];
      this.dataSourceFiltered = this.transactions;
      this.search();
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const field = event.field;

      let value1;
      let value2;

      switch (field) {
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
        default:
          value1 = data1[field];
          value2 = data2[field];
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

  search() {
    const sender = this.senderSearchRef.nativeElement.value || '';
    const receiver = this.receiverSearchRef.nativeElement.value || '';

    this.dataSourceFiltered = this.transactions.filter(tx => (
      TransactionUtil.getSenderAddress(tx, this.unspentTxOuts).toLowerCase().includes(sender?.toLowerCase())
    ));

    this.dataSourceFiltered = this.dataSourceFiltered.filter(tx => (
      TransactionUtil.getReceiverAddress(tx).toLowerCase().includes(receiver.toLowerCase())
    ));
  }
}
