import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SnackbarStatusEnum } from '../enums/snackbar-status.enum';

export interface ISnackbarConfig {
  duration?: number;
  summary?: string;
  message?: string;
  status?: SnackbarStatusEnum;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  static DEFAULT_CONFIG: ISnackbarConfig = {
    duration: 5000,
    status: SnackbarStatusEnum.info
  };

  constructor(private messageService: MessageService) {
  }

  getConfig(config?: ISnackbarConfig): any {
    return {
      life: config?.duration ?? SnackbarService.DEFAULT_CONFIG.duration,
      severity: config?.status ?? SnackbarService.DEFAULT_CONFIG.status,
      detail: config?.message ?? 'Message',
      summary: config?.summary ?? 'Title'
    };
  }

  open(config?: ISnackbarConfig): void {
    this.messageService.add(this.getConfig(config));
  }

  openWarningAnnouncement(message?: string): void {
    this.open({
      message: message ?? 'Warning Announcement Message',
      summary: 'Warning Actions',
      status: SnackbarStatusEnum.warn
    });
  }

  openSuccessAnnouncement(message?: string): void {
    this.open({
      message: message ?? 'Success Announcement Message',
      summary: 'Success Actions',
      status: SnackbarStatusEnum.success
    });
  }

  openSaveSuccessAnnouncement(message?: string): void {
    this.open({
      message: message ?? 'Saved successfully',
      summary: 'Success Actions',
      status: SnackbarStatusEnum.success
    });
  }

  openInfoAnnouncement(message?: string): void {
    this.open({
      message: message ?? 'Information Announcement Message',
      summary: 'Information Actions',
      status: SnackbarStatusEnum.info
    });
  }

  openErrorAnnouncement(message?: string): void {
    this.open({
      message: message ?? 'Error Announcement Message',
      summary: 'Error Actions',
      status: SnackbarStatusEnum.error
    });
  }

  openRequestErrorAnnouncement(error: any): void {
    this.open({
      summary: 'Error Actions',
      message: error?.error?.error?.message ?? error?.error?.message ?? error?.error?.error ?? error?.message ?? error?.statusText ?? error ?? 'Request error',
      status: SnackbarStatusEnum.error
    });
  }
}
