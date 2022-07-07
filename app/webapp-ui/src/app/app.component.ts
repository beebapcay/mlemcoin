import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { MenuItem } from 'primeng/api';
import { AppRouteConstant } from './common/app-route.constant';
import { SubscriptionAwareAbstractComponent } from './components/subscription-aware.abstract.component';
import { NotSupportedErrorModel } from './models/error.model';
import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  readonly NotSupportedErrorModel = NotSupportedErrorModel;

  breadcrumb: MenuItem[] = [];

  constructor(public titleService: Title,
              public router: Router,
              public route: ActivatedRoute,
              public timeagoIntlService: TimeagoIntl,
              public breadcrumbService: BreadcrumbService) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle(AppRouteConstant.TAB_TITLE);

    this.timeagoIntlService.strings = englishStrings;
    this.timeagoIntlService.changes.next();

    this.registerSubscription(
      this.breadcrumbService.breadcrumb.subscribe(breadcrumb => {
        this.breadcrumb = breadcrumb;
      })
    );
  }
}
