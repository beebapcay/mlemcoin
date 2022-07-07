import { Component, Input, OnInit } from '@angular/core';
import { Block } from '../../../models/block.model';

@Component({
  selector: 'mlemscan-latest-block-table',
  templateUrl: './latest-block-table.component.html',
  styleUrls: ['./latest-block-table.component.scss']
})
export class LatestBlockTableComponent implements OnInit {
  @Input() blocks: Block[] = [];

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.blocks);
    console.log('hello');
  }

}
