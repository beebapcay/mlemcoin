import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'app-loading-progress-bar',
  templateUrl: './loading-progress-bar.component.html',
  styleUrls: ['./loading-progress-bar.component.scss']
})
export class LoadingProgressBarComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  loading: boolean = false;

  constructor(private loadingService: LoadingService) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      this.loadingService.loadingBar.subscribe(isLoading => {
        this.loading = isLoading;
      })
    );
  }
}
