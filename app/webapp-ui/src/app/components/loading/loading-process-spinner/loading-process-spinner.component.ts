import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'app-loading-process-spinner',
  templateUrl: './loading-process-spinner.component.html',
  styleUrls: ['./loading-process-spinner.component.scss']
})
export class LoadingProcessSpinnerComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  loading: boolean = false;

  constructor(private loadingService: LoadingService) {
    super();
  }

  ngOnInit(): void {
    this.registerSubscription(
      this.loadingService.loadingSpinner.subscribe(isLoading => {
        this.loading = isLoading;
      })
    );
  }
}
