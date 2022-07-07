import { Pipe, PipeTransform } from '@angular/core';
import { Block } from '../models/block.model';
import { BlockUtil } from '../utils/block.util';

@Pipe({
  name: 'blockTxsValue'
})
export class BlockTxsValuePipe implements PipeTransform {

  transform(value: Block, ...args: unknown[]): number {
    if (value === null) return 0;
    return BlockUtil.getTotalValue(value);
  }
}
