import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRouteConstant } from '../../../../common/app-route.constant';
import { AppSrcAssetsConstant } from '../../../../common/app-src-assets.constant';
import { Block } from '../../../../models/block.model';

@Component({
  selector: 'mlemscan-dashboard-latest-block-table',
  templateUrl: './latest-block-table.component.html',
  styleUrls: ['./latest-block-table.component.scss']
})
export class LatestBlockTableComponent implements OnInit {
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;

  @Input() blocks: Block[] = [];

  constructor(public router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  navigateViewMore() {
    this.router.navigate([AppRouteConstant.LATEST_BLOCKS], { relativeTo: this.route }).then();
  }
}
