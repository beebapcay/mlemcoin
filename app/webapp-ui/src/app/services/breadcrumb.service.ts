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

  public setBreadcrumb(breadcrumb: MenuItem[]): void {
    this.breadcrumb.next(breadcrumb);
  }

  public clearBreadcrumb(): void {
    this.breadcrumb.next([]);
  }

  public resetHome(): void {
    const homeItem: MenuItem = { icon: 'pi pi-home', routerLink: AppRouteConstant.ROOT };
    this.breadcrumb.next([homeItem]);
  }

  public getBreadcrumb(): BehaviorSubject<MenuItem[]> {
    return this.breadcrumb;
  }

  public addBreadcrumb(breadcrumb: MenuItem): void {
    const breadcrumbItems = this.breadcrumb.getValue();
    breadcrumbItems.push(breadcrumb);
    this.breadcrumb.next(breadcrumbItems);
  }

  public backBreadcrumb(): void {
    const breadcrumbItems = this.breadcrumb.getValue();
    breadcrumbItems.pop();
    this.breadcrumb.next(breadcrumbItems);
  }
}
