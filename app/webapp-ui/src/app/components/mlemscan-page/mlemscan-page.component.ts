import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';

@Component({
  selector: 'app-mlemscan-page',
  templateUrl: './mlemscan-page.component.html',
  styleUrls: ['./mlemscan-page.component.scss']
})
export class MlemscanPageComponent {
  breadcrumb: MenuItem[] = [{
    label: 'Mlemscan Dashboard',
    routerLink: [AppRouteConstant.MLEMSCAN]
  }];

  constructor() {
  }
}
