import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteConstant } from './common/app-route.constant';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MlemscanPageComponent } from './components/mlemscan-page/mlemscan-page.component';
import { PageNotFoundErrorModel } from './models/error.model';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: AppRouteConstant.HOME, redirectTo: AppRouteConstant.MLEMSCAN, pathMatch: 'full' },
      { path: AppRouteConstant.MLEMSCAN, component: MlemscanPageComponent },
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
