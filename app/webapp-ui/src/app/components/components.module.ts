import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxIntlModule } from '../ngx-intl.module';
import { PipeModule } from '../pipes/pipe.module';
import { PrimengModule } from '../primeng.module';
import { DetailBlockTableComponent } from './detail-block-table/detail-block-table.component';
import { DetailStylingTableComponent } from './detail-styling-table/detail-styling-table.component';
import { DetailTransactionTableComponent } from './detail-transaction-table/detail-transaction-table.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoadingProcessSpinnerComponent } from './loading/loading-process-spinner/loading-process-spinner.component';
import { LoadingProgressBarComponent } from './loading/loading-progress-bar/loading-progress-bar.component';
import { MenuNavbarComponent } from './menu-navbar/menu-navbar.component';
import { AllBlocksPageComponent } from './mlemscan-page/all-blocks-page/all-blocks-page.component';
import { AllTransactionsPageComponent } from './mlemscan-page/all-transactions-page/all-transactions-page.component';
import { DashboardPageComponent } from './mlemscan-page/dashboard-page/dashboard-page.component';
import { LatestBlockTableComponent } from './mlemscan-page/dashboard-page/latest-block-table/latest-block-table.component';
import { LatestTransactionsTableComponent } from './mlemscan-page/dashboard-page/latest-transactions-table/latest-transactions-table.component';
import { MlemscanPageComponent } from './mlemscan-page/mlemscan-page.component';
import { P2pManagementPageComponent } from './mlemscan-page/p2p-management-page/p2p-management-page.component';
import { TransactionPoolPageComponent } from './mlemscan-page/transaction-pool-page/transaction-pool-page.component';
import { WalletTrackerPageComponent } from './mlemscan-page/wallet-tracker-page/wallet-tracker-page.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SubscriptionAwareAbstractComponent } from './subscription-aware.abstract.component';
import { SummaryStylingTableComponent } from './summary-styling-table/summary-styling-table.component';
import { WalletGeneralInfoPanelComponent } from './wallet-management-page/wallet-general-info-panel/wallet-general-info-panel.component';
import { WalletManagementPageComponent } from './wallet-management-page/wallet-management-page.component';
import { WalletStateManagementComponent } from './wallet-management-page/wallet-state-management/wallet-state-management.component';
import {
  WalletHistoryTxsTabComponent
} from './wallet-management-page/wallet-tabview-content/wallet-history-txs-tab/wallet-history-txs-tab.component';
import {
  WalletPendingTxsTabComponent
} from './wallet-management-page/wallet-tabview-content/wallet-pending-txs-tab/wallet-pending-txs-tab.component';
import { WalletTabviewContentComponent } from './wallet-management-page/wallet-tabview-content/wallet-tabview-content.component';

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
    LatestBlockTableComponent,
    LatestTransactionsTableComponent,
    P2pManagementPageComponent,
    TransactionPoolPageComponent,
    WalletTrackerPageComponent,
    DashboardPageComponent,
    SummaryStylingTableComponent,
    DetailStylingTableComponent,
    DetailTransactionTableComponent,
    AllTransactionsPageComponent,
    AllBlocksPageComponent,
    DetailBlockTableComponent,
    WalletManagementPageComponent,
    WalletStateManagementComponent,
    WalletGeneralInfoPanelComponent,
    WalletTabviewContentComponent,
    WalletHistoryTxsTabComponent,
    WalletPendingTxsTabComponent
  ],
  exports: [
    CommonModule,
    MenuNavbarComponent,
    ErrorPageComponent,
    LoadingProgressBarComponent,
    LoadingProcessSpinnerComponent,
    SnackbarComponent
  ]
})
export class ComponentsModule {
}
