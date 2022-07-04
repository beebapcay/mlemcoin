import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRouteConstant } from './common/app-route.constant';
import { SubscriptionAwareAbstractComponent } from './components/subscription-aware.abstract.component';
import { NotSupportedErrorModel } from './models/error.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  readonly NotSupportedErrorModel = NotSupportedErrorModel;

  constructor(public titleService: Title,
              public router: Router,
              public route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle(AppRouteConstant.TAB_TITLE);
  }
}
