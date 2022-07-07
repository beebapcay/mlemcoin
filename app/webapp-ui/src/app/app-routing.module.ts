import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteConstant } from './common/app-route.constant';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { DashboardPageComponent } from './components/mlemscan-page/dashboard-page/dashboard-page.component';
import { MlemscanPageComponent } from './components/mlemscan-page/mlemscan-page.component';
import {
  P2pManagementPageComponent
} from './components/mlemscan-page/p2p-management-page/p2p-management-page.component';
import { PageNotFoundErrorModel } from './models/error.model';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: AppRouteConstant.HOME, redirectTo: AppRouteConstant.MLEMSCAN, pathMatch: 'full' },
      {
        path: AppRouteConstant.MLEMSCAN, component: MlemscanPageComponent, children: [
          { path: AppRouteConstant.HOME, component: DashboardPageComponent },
          { path: AppRouteConstant.P2P_MANAGEMENT, component: P2pManagementPageComponent }
        ]
      },
      { path: AppRouteConstant.OTHER, component: ErrorPageComponent, data: PageNotFoundErrorModel.create() }
    ])
  ],
  exports: [
    CommonModule,
    RouterModule
  ]
})
export class AppRoutingModule {
}
