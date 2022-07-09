import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { AppSrcAssetsConstant } from '../../../common/app-src-assets.constant';
import { Block } from '../../../models/block.model';
import { ArrayUtil } from '../../../utils/array.util';
import { BlockUtil } from '../../../utils/block.util';
import { CompareUtil } from '../../../utils/compare.util';


@Component({
  selector: 'mlemscan-detail-block-table',
  templateUrl: './detail-block-table.component.html',
  styleUrls: ['./detail-block-table.component.scss']
})
export class DetailBlockTableComponent implements OnChanges {
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;

  @Input() caption: string = 'Detail Transaction';
  @Input() blocks: Block[] = [];

  dataSourceFiltered: Block[] = [];

  @ViewChild('minerSearch') minerSearch: ElementRef;
  @ViewChild('idOrHashSearch') idOrHashSearch: ElementRef;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const blocksPrevious = changes['blocks'].previousValue;
    const blocksCurrent = changes['blocks'].currentValue;

    const compareRes = !blocksPrevious
      || !blocksCurrent
      || ArrayUtil.equals(blocksPrevious, blocksCurrent, (b1: Block, b2: Block) => (
        (b1.index < b2.index) ? -1 : (b1.index > b2.index) ? 1 : 0
      ));

    if (!compareRes) {
      this.blocks = changes['blocks'].currentValue ?? [];
      this.dataSourceFiltered = this.blocks;
      this.search();
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const field = event.field;

      let value1;
      let value2;

      switch (field) {
        case 'award':
          value1 = data1.data[0]?.txOuts[0]?.amount;
          value2 = data2.data[0]?.txOuts[0]?.amount;
          break;
        case 'txs':
          value1 = data1.data.length;
          value2 = data2.data.length;
          break;
        case 'hold':
          value1 = BlockUtil.getTotalValue(data1);
          value2 = BlockUtil.getTotalValue(data2);
          break;
        default:
          value1 = data1[field];
          value2 = data2[field];
      }

      return (event.order * CompareUtil.compareValue(value1, value2));
    });
  }

  search() {
    const idOrHash = this.idOrHashSearch.nativeElement.value || '';
    const miner = this.minerSearch.nativeElement.value || '';

    this.dataSourceFiltered = this.blocks.filter(b => (
      b.index === parseInt(idOrHash) || b.hash.includes(idOrHash)
    ));

    this.dataSourceFiltered = this.dataSourceFiltered.filter(b => (
      b.data[0]?.txOuts[0]?.address?.includes(miner)
    ));
  }
}
