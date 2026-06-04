import type { Page } from '@playwright/test';

export class ConfirmationPage {
  constructor(private readonly page: Page) {}

  get successHeader() {
    return this.page.locator('.confirm-success');
  }

  get errorHeader() {
    return this.page.locator('.confirm-error');
  }

  get loadingSection() {
    return this.page.locator('.confirm-loading');
  }

  get emptySection() {
    return this.page.locator('.confirm-empty');
  }

  get successTitle() {
    return this.page.locator('.confirm-success h2');
  }

  get bookingId() {
    return this.page.locator('.confirm-id strong');
  }

  get errorTitle() {
    return this.page.locator('.confirm-error h2');
  }

  get errorMessage() {
    return this.page.locator('.confirm-error p');
  }

  get retryButton() {
    return this.page.getByRole('button', { name: 'Erneut versuchen' });
  }

  get totalPrice() {
    return this.page.locator('.total-value');
  }

  get backToRoomsButton() {
    return this.page.getByRole('button', { name: 'Zurück zur Zimmerübersicht' });
  }

  get bookingPeriodInfo() {
    return this.page.locator('.confirm-success booking-period-info');
  }

  get roomInfo() {
    return this.page.locator('.confirm-success room-info');
  }

  get guestInfo() {
    return this.page.locator('.confirm-success guest-info');
  }

  async waitForSuccess() {
    await this.successHeader.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForError() {
    await this.errorHeader.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForLoading() {
    await this.loadingSection.waitFor({ state: 'visible', timeout: 10000 });
  }

  async isSuccessVisible(): Promise<boolean> {
    return this.successHeader.isVisible();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorHeader.isVisible();
  }

  async isLoadingVisible(): Promise<boolean> {
    return this.loadingSection.isVisible();
  }

  async getBookingIdText(): Promise<string> {
    return (await this.bookingId.textContent()) ?? '';
  }

  async getTotalPriceText(): Promise<string> {
    return (await this.totalPrice.textContent()) ?? '';
  }

  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async getSuccessTitleText(): Promise<string> {
    return (await this.successTitle.textContent()) ?? '';
  }

  async getErrorTitleText(): Promise<string> {
    return (await this.errorTitle.textContent()) ?? '';
  }

  async retry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async backToRooms() {
    await this.backToRoomsButton.click();
  }
}
