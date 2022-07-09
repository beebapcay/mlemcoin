import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
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
    CardModule,
    BreadcrumbModule,
    InputTextModule
  ],
  providers: [
    MessageService
  ]
})
export class PrimengModule {
}
