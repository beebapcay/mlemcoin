import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FooterNavComponent } from './footer-nav/footer-nav.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
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
    HeaderNavComponent,
    FooterNavComponent,
    MlemscanPageComponent,
    ErrorPageComponent
  ],
  exports: [
    CommonModule,
    HeaderNavComponent,
    FooterNavComponent,
    MlemscanPageComponent,
    ErrorPageComponent
  ]
})
export class ComponentsModule {
}
