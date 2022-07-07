import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';
import { MlemscanPageComponent } from '../mlemscan-page.component';

@Component({
  selector: 'app-p2p-management-page',
  templateUrl: './p2p-management-page.component.html',
  styleUrls: ['./p2p-management-page.component.scss']
})
export class P2pManagementPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {

  breadcrumb: MenuItem[] = [{
    label: 'P2P Management',
    routerLink: ['/p2p-management']
  }];

  constructor(public router: Router,
              public breadcrumbService: BreadcrumbService,
              public mlemscanPage: MlemscanPageComponent) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbService.resetHome();
    this.breadcrumbService.addBreadcrumbs([...this.mlemscanPage.breadcrumb, ...this.breadcrumb]);
  }

}
