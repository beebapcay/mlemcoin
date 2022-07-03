import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteConstant } from './common/app-route.constant';
import { MlemscanPageComponent } from './components/mlemscan-page/mlemscan-page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: AppRouteConstant.HOME, redirectTo: AppRouteConstant.MLEMSCAN, pathMatch: 'full' },
      { path: AppRouteConstant.MLEMSCAN, component: MlemscanPageComponent }
    ])
  ],
  exports: [
    CommonModule,
    RouterModule
  ]
})
export class AppRoutingModule {
}
