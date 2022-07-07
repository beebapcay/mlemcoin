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
    // this.subscriptions.push(
    //   this.blockchainService.getBlockchain()
    //     .subscribe(blockchain => {
    //         this.blockchain = blockchain;
    //       })
    // );

    this.blockchain = new Blockchain({
      'chain': [
        {
          'index': 0,
          'timestamp': 1657159830.473,
          'hash': '8c3bf7e98d1f2561e8f61a3f26234f351b961f368f7a895f748223b06723a586',
          'previousHash': '',
          'data': [
            {
              'id': 'b290d663c20afb656d7c7d6874dafeaed0f6900ca6b5c7acf1737dee24fe1275',
              'txIns': [
                {
                  'txOutId': '',
                  'txOutIndex': 0,
                  'signature': ''
                }
              ],
              'txOuts': [
                {
                  'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
                  'amount': 50
                }
              ]
            },
            {
              'id': 'b0128888c86426ba2694edddfaf4b693e403f149ec66e77714f5f29d54e26f1e',
              'txIns': [
                {
                  'signature': '',
                  'txOutId': '',
                  'txOutIndex': 0
                }
              ],
              'txOuts': [
                {
                  'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
                  'amount': 1000000
                }
              ]
            }
          ],
          'difficulty': 0,
          'nonce': 0
        }
      ]
    });
  }
}
