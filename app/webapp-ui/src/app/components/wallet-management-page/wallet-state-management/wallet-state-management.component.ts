import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import { Wallet } from '../../../models/wallet.model';
import { PersistenceService } from '../../../services/persistence.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { WalletService } from '../../../services/wallet.service';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-wallet-state-management',
  templateUrl: './wallet-state-management.component.html',
  styleUrls: ['./wallet-state-management.component.scss']
})
export class WalletStateManagementComponent extends SubscriptionAwareAbstractComponent implements OnInit {
  privateKeyGenerated: string;
  wallet: Wallet;

  connectPrivateKeyForm: FormGroup;

  constructor(public walletService: WalletService,
              public fbService: FormBuilder,
              public snackbarService: SnackbarService,
              public persistenceService: PersistenceService) {
    super();
  }

  ngOnInit(): void {
    this.connectPrivateKeyForm = this.fbService.group({
      privateKey: ['', [Validators.required, Validators.minLength(64), Validators.maxLength(64)]]
    });

    this.fetching();
  }

  fetching() {
    this.walletService.getMyWalletDetails().subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.handleFormConnected(wallet.privateKey);
      },
      error: () => {
        this.walletService.publicKey.next(null);
        this.wallet = null;
      }
    });
  }

  generatePrivateKey() {
    this.walletService.generatePrivateKey()
      .subscribe(privateKey => {
        this.privateKeyGenerated = privateKey;
      });
  }

  connect() {
    this.connectPrivateKeyForm.markAllAsTouched();

    if (this.connectPrivateKeyForm.invalid) {
      this.snackbarService.openErrorAnnouncement('Please enter a valid private key');
      return;
    }

    if (this.walletService.publicKey.value) {
      this.snackbarService.openErrorAnnouncement('You are already connected to a wallet. Please disconnect first.');
      return;
    }

    const privateKey = this.connectPrivateKeyForm.controls['privateKey'].value;


    this.walletService.connect(privateKey)
      .pipe(
        mergeMap(() => this.walletService.getAddress())
      )
      .subscribe({
        next: (address) => {
          this.walletService.publicKey.next(address);
          this.snackbarService.openSuccessAnnouncement('Connected to wallet successfully');
          this.handleFormConnected(privateKey);
        },
        error: () => {
          this.walletService.publicKey.next(null);
        }
      });

  }

  disconnect() {
    this.walletService.disconnect()
      .subscribe(() => {
        this.walletService.publicKey.next(null);
        this.handleFormDisconnected();
        this.snackbarService.openSuccessAnnouncement('Disconnected from wallet successfully');
      });
  }

  handleFormConnected(privateKey: string) {
    this.connectPrivateKeyForm.disable();
    this.connectPrivateKeyForm.controls['privateKey'].setValue(privateKey);
  }

  handleFormDisconnected() {
    this.connectPrivateKeyForm.enable();
    this.connectPrivateKeyForm.reset();
  }
}
