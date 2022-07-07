import { NgModule } from '@angular/core';
import { BlockTxsValuePipe } from './block-txs-value.pipe';
import { ShortNumberPipe } from './short-number.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  imports: [],
  exports: [
    TruncatePipe,
    BlockTxsValuePipe,
    ShortNumberPipe
  ],
  declarations: [
    TruncatePipe,
    BlockTxsValuePipe,
    ShortNumberPipe
  ],
  providers: []
})
export class PipeModule {
}
