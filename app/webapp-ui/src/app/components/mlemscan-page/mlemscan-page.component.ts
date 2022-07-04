import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blockchain } from '../../models/blockchain.model';
import { BlockchainService } from '../../services/blockchain.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SubscriptionAwareAbstractComponent } from '../subscription-aware.abstract.component';

@Component({
  selector: 'app-mlemscan-page',
  templateUrl: './mlemscan-page.component.html',
  styleUrls: ['./mlemscan-page.component.scss']
})
export class MlemscanPageComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  blockchain: Blockchain;

  constructor(public router: Router,
              public blockchainService: BlockchainService,
              public snackbarService: SnackbarService) {
    super();
  }

  ngOnInit(): void {
  }
}
