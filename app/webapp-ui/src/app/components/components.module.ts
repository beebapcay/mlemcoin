import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoadingProcessSpinnerComponent } from './loading/loading-process-spinner/loading-process-spinner.component';
import { LoadingProgressBarComponent } from './loading/loading-progress-bar/loading-progress-bar.component';
import { MenuNavbarComponent } from './menu-navbar/menu-navbar.component';
import { MlemscanPageComponent } from './mlemscan-page/mlemscan-page.component';
import { SubscriptionAwareAbstractComponent } from './subscription-aware.abstract.component';

@NgModule({
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [
    SubscriptionAwareAbstractComponent,
    MenuNavbarComponent,
    MlemscanPageComponent,
    ErrorPageComponent,
    LoadingProgressBarComponent,
    LoadingProcessSpinnerComponent
  ],
  exports: [
    CommonModule,
    MenuNavbarComponent,
    MlemscanPageComponent,
    ErrorPageComponent,
    LoadingProgressBarComponent,
    LoadingProcessSpinnerComponent
  ]
})
export class ComponentsModule {
}
