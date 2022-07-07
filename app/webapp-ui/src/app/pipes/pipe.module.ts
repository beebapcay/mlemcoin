import { NgModule } from '@angular/core';
import { BlockTxsValuePipe } from './block-txs-value.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  imports: [],
  exports: [
    TruncatePipe,
    BlockTxsValuePipe
  ],
  declarations: [
    TruncatePipe,
    BlockTxsValuePipe
  ],
  providers: []
})
export class PipeModule {
}
