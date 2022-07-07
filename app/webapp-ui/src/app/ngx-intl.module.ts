import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';

import { CustomTimeagoIntlUtil } from './utils/custom-timeago-intl.util';

@NgModule({
  imports: [
    CommonModule,
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: CustomTimeagoIntlUtil },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
    })
  ],
  exports: [
    CommonModule,
    TimeagoModule
  ],
  declarations: [],
  providers: []
})
export class NgxIntlModule {
}
