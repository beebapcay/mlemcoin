import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
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
  privateKeyConnected: string;

  connectPrivateKeyForm: FormGroup;

  constructor(public walletService: WalletService,
              public fbService: FormBuilder,
              public snackbarService: SnackbarService) {
    super();
  }

  ngOnInit(): void {
    this.connectPrivateKeyForm = this.fbService.group({
      privateKey: ['', [Validators.required, Validators.minLength(64), Validators.maxLength(64)]]
    });

    this.registerSubscription(
      this.walletService.privateKey.subscribe(privateKey => {
        this.privateKeyConnected = privateKey;
        if (privateKey) {
          this.connectPrivateKeyForm.disable();
          this.connectPrivateKeyForm.controls['privateKey'].setValue(privateKey);
        } else {
          this.connectPrivateKeyForm.enable();
          this.connectPrivateKeyForm.reset();
        }
      })
    );
  }

  generatePrivateKey() {
    this.registerSubscription(
      this.walletService.generatePrivateKey()
        .subscribe(privateKey => {
          this.privateKeyGenerated = privateKey;
        })
    );
  }

  connect() {
    this.connectPrivateKeyForm.markAllAsTouched();

    if (this.connectPrivateKeyForm.invalid) {
      this.snackbarService.openErrorAnnouncement('Please enter a valid private key');
      return;
    }

    if (this.privateKeyConnected) {
      console.log(this.privateKeyConnected);
      this.snackbarService.openErrorAnnouncement('You are already connected to a wallet. Please disconnect first.');
      return;
    }

    const privateKey = this.connectPrivateKeyForm.controls['privateKey'].value;

    this.registerSubscription(
      this.walletService.connect(privateKey)
        .pipe(
          mergeMap(() => this.walletService.getAddress())
        )
        .subscribe({
          next: (address) => {
            this.walletService.privateKey.next(privateKey);
            this.walletService.publicKey.next(address);
            this.snackbarService.openSuccessAnnouncement('Connected to wallet successfully');
          },
          error: () => {
            this.walletService.privateKey.next(null);
          }
        })
    );
  }

  disconnect() {
    this.registerSubscription(
      this.walletService.disconnect()
        .subscribe(() => {
          this.walletService.privateKey.next(null);
          this.snackbarService.openSuccessAnnouncement('Disconnected from wallet successfully');
        })
    );
  }
}
