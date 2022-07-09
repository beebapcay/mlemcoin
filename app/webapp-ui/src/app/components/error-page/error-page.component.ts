import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppRouteConstant } from '../../common/app-route.constant';
import { AppSrcAssetsConstant } from '../../common/app-src-assets.constant';
import { ErrorEnum } from '../../enums/error.enum';
import { ErrorModel } from '../../models/error.model';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  @Input() error: ErrorModel;

  readonly AppRouteConstant = AppRouteConstant;
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;
  readonly ErrorEnum = ErrorEnum;

  constructor(private route: ActivatedRoute,
              private breadcrumbService: BreadcrumbService) {
    super();
    this.registerSubscription(
      this.route.data.subscribe(data => {
          this.error = data as ErrorModel;
        }
      ));
  }

  ngOnInit() {
    setTimeout(() => {
      this.breadcrumbService.clearBreadcrumb();
    }, 0);
  }
}
