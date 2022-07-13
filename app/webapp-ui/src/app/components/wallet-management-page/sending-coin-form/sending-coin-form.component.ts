import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import { TransactionService } from '../../../services/transaction.service';
import { WalletUtil } from '../../../utils/wallet.util';
import { SubscriptionAwareAbstractComponent } from '../../subscription-aware.abstract.component';

@Component({
  selector: 'walletmgmt-sending-coin-form',
  templateUrl: './sending-coin-form.component.html',
  styleUrls: ['./sending-coin-form.component.scss']
})
export class SendingCoinFormComponent extends SubscriptionAwareAbstractComponent implements OnInit {

  sendingCoinForm: FormGroup;

  constructor(public fb: FormBuilder,
              public transactionService: TransactionService,
              public snackbarService: SnackbarService) {
    super();
  }

  ngOnInit(): void {
    this.sendingCoinForm = this.fb.group({
      receiverAddress: new FormControl('', [Validators.required]),
      amount: ['', Validators.required]
    });
  }

  sendCoin(): void {
    this.sendingCoinForm.markAllAsTouched();
    Object.keys(this.sendingCoinForm.controls).forEach(key => {
      this.sendingCoinForm.get(key).markAsDirty();
    });

    if (this.sendingCoinForm.invalid) {
      this.snackbarService.openErrorAnnouncement('Please fill in all required fields with valid values');
      return;
    }

    const receiverAddressControl = this.sendingCoinForm.controls['receiverAddress'];
    const amountControl = this.sendingCoinForm.controls['amount'];

    const validatePublicKeyReceiverAddress = WalletUtil.validatePublicKey(receiverAddressControl.value);

    if (!validatePublicKeyReceiverAddress.res) {
      this.snackbarService.openErrorAnnouncement(validatePublicKeyReceiverAddress.error.message);
      receiverAddressControl.setErrors({ invalidAddress: true });
      return;
    }

    this.registerSubscription(
      this.transactionService
        .sendCoin(receiverAddressControl.value, amountControl.value)
        .subscribe({
          next: () => {
            this.snackbarService.openSuccessAnnouncement('Coins are sent successfully to pool. Please wait for the transaction to be confirmed.');
          },
          error: (err) => {
            this.snackbarService.openErrorAnnouncement('Error while sending coins to pool. Please try again later.');
          }
        })
    );
  }
}
