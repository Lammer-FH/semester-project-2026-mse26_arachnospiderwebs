import type { Page } from '@playwright/test';

export class ReviewPage {
  constructor(private readonly page: Page) {}

  private section(label: string) {
    return this.page.locator('.review-section').filter({ hasText: label });
  }

  private reviewValue(sectionLabel: string, fieldLabel: string) {
    return this.section(sectionLabel)
      .locator('ion-item')
      .filter({ hasText: fieldLabel })
      .locator('ion-text[slot="end"], span[slot="end"]');
  }

  get checkIn() {
    return this.reviewValue('Buchungszeitraum', 'Anreise');
  }

  get checkOut() {
    return this.reviewValue('Buchungszeitraum', 'Abreise');
  }

  get nights() {
    return this.reviewValue('Buchungszeitraum', 'Nächte');
  }

  get roomTitle() {
    return this.section('Zimmer').locator('strong');
  }

  get roomPrice() {
    return this.section('Zimmer').locator('p').filter({ hasText: /Nacht/ });
  }

  get guestFirstName() {
    return this.reviewValue('Gast', 'Vorname');
  }

  get guestLastName() {
    return this.reviewValue('Gast', 'Nachname');
  }

  get guestEmail() {
    return this.reviewValue('Gast', 'E-Mail');
  }

  get breakfast() {
    return this.reviewValue('Gast', 'Frühstück');
  }

  get totalPrice() {
    return this.page.locator('.total-price');
  }

  get editGuestButton() {
    return this.section('Gast').getByRole('button', { name: 'Bearbeiten' });
  }

  get editRoomButton() {
    return this.section('Zimmer').getByRole('button', { name: 'Bearbeiten' });
  }

  async getCheckInText(): Promise<string> {
    return (await this.checkIn.textContent()) ?? '';
  }

  async getCheckOutText(): Promise<string> {
    return (await this.checkOut.textContent()) ?? '';
  }

  async getNightsText(): Promise<string> {
    return (await this.nights.textContent()) ?? '';
  }

  async getRoomTitleText(): Promise<string> {
    return (await this.roomTitle.textContent()) ?? '';
  }

  async getGuestFirstNameText(): Promise<string> {
    return (await this.guestFirstName.textContent()) ?? '';
  }

  async getGuestLastNameText(): Promise<string> {
    return (await this.guestLastName.textContent()) ?? '';
  }

  async getGuestEmailText(): Promise<string> {
    return (await this.guestEmail.textContent()) ?? '';
  }

  async getBreakfastText(): Promise<string> {
    return (await this.breakfast.textContent()) ?? '';
  }

  async getTotalPriceText(): Promise<string> {
    return (await this.totalPrice.textContent()) ?? '';
  }

  async editGuest() {
    await this.editGuestButton.click();
  }

  async editRoom() {
    await this.editRoomButton.click();
  }
}
