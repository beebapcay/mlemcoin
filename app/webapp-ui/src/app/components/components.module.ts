import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng.module';
import { FooterNavComponent } from './footer-nav/footer-nav.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { MlemscanPageComponent } from './mlemscan-page/mlemscan-page.component';

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
    HeaderNavComponent,
    FooterNavComponent,
    MlemscanPageComponent
  ],
  exports: [
    CommonModule,
    HeaderNavComponent,
    FooterNavComponent,
    MlemscanPageComponent
  ]
})
export class ComponentsModule {
}
