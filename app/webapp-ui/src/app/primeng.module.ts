import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@NgModule({
  exports: [
    ButtonModule,
    MenubarModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    TableModule,
    ToastModule,
    MessageModule,
    CardModule
  ],
  providers: [
    MessageService
  ]
})
export class PrimengModule {
}
