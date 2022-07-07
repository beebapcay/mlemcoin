import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';

@Component({
  selector: 'app-mlemscan-page',
  templateUrl: './mlemscan-page.component.html',
  styleUrls: ['./mlemscan-page.component.scss']
})
export class MlemscanPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  breadcrumb: MenuItem[] = [{
    label: 'Mlemscan Dashboard',
    routerLink: [AppRouteConstant.MLEMSCAN]
  }];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
