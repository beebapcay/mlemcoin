import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';
import { AppSrcAssetsConstant } from '../../common/app-src-assets.constant';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';
import { MenuNavbarItems } from './menu-navbar-items.constant';

@Component({
  selector: 'app-menu-navbar',
  templateUrl: './menu-navbar.component.html',
  styleUrls: ['./menu-navbar.component.scss']
})
export class MenuNavbarComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;
  readonly AppRouteConstant = AppRouteConstant;

  items: MenuItem[] = MenuNavbarItems;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
