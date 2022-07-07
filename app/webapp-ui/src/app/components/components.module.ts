import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxIntlModule } from '../ngx-intl.module';
import { PipeModule } from '../pipes/pipe.module';
import { PrimengModule } from '../primeng.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoadingProcessSpinnerComponent } from './loading/loading-process-spinner/loading-process-spinner.component';
import { LoadingProgressBarComponent } from './loading/loading-progress-bar/loading-progress-bar.component';
import { MenuNavbarComponent } from './menu-navbar/menu-navbar.component';
import { DashboardPageComponent } from './mlemscan-page/dashboard-page/dashboard-page.component';
import {
  LatestBlockTableComponent
} from './mlemscan-page/dashboard-page/latest-block-table/latest-block-table.component';
import {
  LatestTransactionsTableComponent
} from './mlemscan-page/dashboard-page/latest-transactions-table/latest-transactions-table.component';
import { MlemscanPageComponent } from './mlemscan-page/mlemscan-page.component';
import { P2pManagementPageComponent } from './mlemscan-page/p2p-management-page/p2p-management-page.component';
import { TransactionPoolPageComponent } from './mlemscan-page/transaction-pool-page/transaction-pool-page.component';
import { WalletTrackerPageComponent } from './mlemscan-page/wallet-tracker-page/wallet-tracker-page.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SubscriptionAwareAbstractComponent } from './subscription-aware.abstract.component';
import { SummaryBlocksTableComponent } from './summary-blocks-table/summary-blocks-table.component';

@NgModule({
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxIntlModule,
    PipeModule
  ],
  declarations: [
    SubscriptionAwareAbstractComponent,
    MenuNavbarComponent,
    MlemscanPageComponent,
    ErrorPageComponent,
    LoadingProgressBarComponent,
    LoadingProcessSpinnerComponent,
    SnackbarComponent,
    SummaryBlocksTableComponent,
    LatestBlockTableComponent,
    LatestTransactionsTableComponent,
    P2pManagementPageComponent,
    TransactionPoolPageComponent,
    WalletTrackerPageComponent,
    DashboardPageComponent
  ],
  exports: [
    CommonModule,
    MenuNavbarComponent,
    MlemscanPageComponent,
    ErrorPageComponent,
    LoadingProgressBarComponent,
    LoadingProcessSpinnerComponent,
    SnackbarComponent,
    DashboardPageComponent,
    P2pManagementPageComponent
  ]
})
export class ComponentsModule {
}
