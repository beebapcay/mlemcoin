import { Block } from '../models/block.model';

export class BlockUtil {
  static getTotalValue(block: Block): number {
    let total = 0;
    for (const tx of block.data) {
      for (const txOut of tx.txOuts) {
        total += txOut.amount;
      }
    }
    return total;
  }
}
