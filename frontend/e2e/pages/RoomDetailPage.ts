import type { Page } from '@playwright/test';
import { setIonDateInput } from '../utils/helpers';

export class RoomDetailPage {
  constructor(private readonly page: Page) {}

  async goto(roomId: number) {
    await this.page.goto(`/rooms/${roomId}`);
    await this.page.waitForLoadState('networkidle');
  }

  get roomTitle() {
    return this.page.locator('h1.room-title');
  }

  get roomDescription() {
    return this.page.locator('p.room-description');
  }

  get availabilityCheckButton() {
    return this.page.getByRole('button', { name: 'Verfügbarkeit prüfen' });
  }

  get bookNowButton() {
    return this.page.getByRole('button', { name: 'Jetzt buchen' });
  }

  get availabilityCard() {
    return this.page.locator('ion-card').filter({ hasText: 'Verfügbar' }).first();
  }

  get unavailabilityCard() {
    return this.page.locator('ion-card').filter({ hasText: 'Nicht verfügbar' }).first();
  }

  get loadingSpinner() {
    return this.page.locator('ion-spinner');
  }

  get errorText() {
    return this.page.locator('.error-text');
  }

  get extrasChips() {
    return this.page.locator('.extras-row ion-chip');
  }

  async selectDates(checkIn: string, checkOut: string) {
    await setIonDateInput(this.page, 'Anreise', checkIn);
    await setIonDateInput(this.page, 'Abreise', checkOut);
  }

  async checkAvailability() {
    await this.availabilityCheckButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async bookNow() {
    await this.bookNowButton.click();
    await this.page.waitForURL('**/booking');
    await this.page.waitForLoadState('networkidle');
  }

  async getRoomTitleText(): Promise<string> {
    return (await this.roomTitle.textContent()) ?? '';
  }

  async isRoomVisible(): Promise<boolean> {
    return this.roomTitle.isVisible();
  }

  async isBookNowVisible(): Promise<boolean> {
    return this.bookNowButton.isVisible();
  }

  async isAvailabilityCheckEnabled(): Promise<boolean> {
    return this.availabilityCheckButton.isEnabled();
  }

  async isShowingError(): Promise<boolean> {
    return this.errorText.isVisible();
  }
}
