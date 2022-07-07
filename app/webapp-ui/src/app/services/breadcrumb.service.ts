import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AppRouteConstant } from '../common/app-route.constant';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  public breadcrumb: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);

  constructor() {
  }

  public initBreadcrumb(breadcrumbs: MenuItem[]): void {
    const homeItem: MenuItem = { icon: 'pi pi-home', routerLink: AppRouteConstant.ROOT };
    this.breadcrumb.next([homeItem, ...breadcrumbs]);
  }
}
