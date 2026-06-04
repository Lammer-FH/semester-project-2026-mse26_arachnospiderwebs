import type { Page, Locator } from '@playwright/test';
import { fillIonInputByLabel, toggleIonCheckbox, triggerIonBlur, getIonInputValue } from '../utils/helpers';
import { ReviewPage } from './ReviewPage';
import { ConfirmationPage } from './ConfirmationPage';

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  breakfast?: boolean;
}

export class BookingWizardPage {
  readonly review: ReviewPage;
  readonly confirmation: ConfirmationPage;

  constructor(private readonly page: Page) {
    this.review = new ReviewPage(page);
    this.confirmation = new ConfirmationPage(page);
  }

  get stepTitle() {
    return this.page.locator('.step-title');
  }

  get stepDescription() {
    return this.page.locator('.step-description');
  }

  get nextButton() {
    return this.page.getByRole('button', { name: 'Weiter' });
  }

  get backButton() {
    return this.page.getByRole('button', { name: 'Zurück' });
  }

  get confirmButton() {
    return this.page.getByRole('button', { name: 'Buchung bestätigen' });
  }

  get progressBreadcrumbs() {
    return this.page.locator('ion-breadcrumbs');
  }

  get breadcrumbSteps() {
    return this.page.locator('ion-breadcrumb');
  }

  get srOnlyAnnouncement() {
    return this.page.locator('.sr-only');
  }

  get firstNameInput() {
    return this.page.locator('ion-item').filter({ hasText: 'Vorname' }).locator('input');
  }

  get lastNameInput() {
    return this.page.locator('ion-item').filter({ hasText: 'Nachname' }).locator('input');
  }

  get emailInput() {
    return this.page.locator('.email-input-wrapper ion-item input');
  }

  get confirmEmailInput() {
    return this.page.locator('.confirm-email-wrapper ion-item input');
  }

  get breakfastToggle() {
    return this.page.locator('ion-item').filter({ hasText: 'Frühstück' }).locator('input[role="switch"]');
  }

  async getFirstNameValue(): Promise<string> {
    return getIonInputValue(this.firstNameInput);
  }

  async getLastNameValue(): Promise<string> {
    return getIonInputValue(this.lastNameInput);
  }

  async getEmailValue(): Promise<string> {
    return getIonInputValue(this.emailInput);
  }

  async getConfirmEmailValue(): Promise<string> {
    return getIonInputValue(this.confirmEmailInput);
  }

  async getBreakfastValue(): Promise<boolean> {
    return this.breakfastToggle.isChecked();
  }

  async getGuestInfo(): Promise<GuestInfo> {
    return {
      firstName: await this.getFirstNameValue(),
      lastName: await this.getLastNameValue(),
      email: await this.getEmailValue(),
      confirmEmail: await this.getConfirmEmailValue(),
      breakfast: await this.getBreakfastValue(),
    };
  }

  private validationMessage(text: string): Locator {
    return this.page.locator('ion-note[color="danger"]', { hasText: text });
  }

  get firstNameRequiredError() {
    return this.validationMessage('Bitte gib deinen Vornamen ein.');
  }

  get lastNameRequiredError() {
    return this.validationMessage('Bitte gib deinen Nachnamen ein.');
  }

  get emailRequiredError() {
    return this.validationMessage('Bitte gib deine E-Mail-Adresse ein.');
  }

  get emailFormatError() {
    return this.validationMessage('Bitte gib eine gültige E-Mail-Adresse ein.');
  }

  get confirmEmailRequiredError() {
    return this.validationMessage('Bitte bestätige deine E-Mail-Adresse.');
  }

  get confirmEmailMismatchError() {
    return this.validationMessage('Die E-Mail-Adressen stimmen nicht überein.');
  }

  async getValidationErrors(): Promise<Locator[]> {
    const notes = this.page.locator('ion-note[color="danger"]');
    const count = await notes.count();
    const result: Locator[] = [];
    for (let i = 0; i < count; i++) {
      result.push(notes.nth(i));
    }
    return result;
  }

  async getValidationErrorCount(): Promise<number> {
    return this.page.locator('ion-note[color="danger"]').count();
  }

  async isOnStep(index: number): Promise<boolean> {
    const step = this.progressBreadcrumbs.locator('ion-breadcrumb').nth(index);
    const classList = await step.getAttribute('class');
    return classList?.includes('breadcrumb-active') ?? false;
  }

  async getCurrentStepIndex(): Promise<number> {
    const crumbs = this.breadcrumbSteps;
    const count = await crumbs.count();
    for (let i = 0; i < count; i++) {
      const classList = await crumbs.nth(i).getAttribute('class');
      if (classList?.includes('breadcrumb-active')) return i;
    }
    return -1;
  }

  async clickBreadcrumb(index: number) {
    const crumb = this.breadcrumbSteps.nth(index);
    await crumb.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async goNext() {
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
    const stepAfter = await this.getCurrentStepIndex();
    const titles = ['Gastinformationen', 'Buchung überprüfen', 'Bestätigung'];
    if (titles[stepAfter]) await this.waitForStepTitle(titles[stepAfter]);
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
    const stepAfter = await this.getCurrentStepIndex();
    const titles = ['Gastinformationen', 'Buchung überprüfen', 'Bestätigung'];
    if (titles[stepAfter]) await this.waitForStepTitle(titles[stepAfter]);
  }

  async confirmBooking() {
    await this.confirmButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isNextEnabled(): Promise<boolean> {
    return this.nextButton.isEnabled();
  }

  async isBackVisible(): Promise<boolean> {
    return this.backButton.isVisible();
  }

  async isConfirmVisible(): Promise<boolean> {
    return this.confirmButton.isVisible();
  }

  async fillGuestInfo(info: GuestInfo) {
    await fillIonInputByLabel(this.page, 'Vorname', info.firstName);
    await fillIonInputByLabel(this.page, 'Nachname', info.lastName);
    await this.emailInput.fill(info.email);
    await this.emailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await this.confirmEmailInput.fill(info.confirmEmail);
    await this.confirmEmailInput.evaluate((el) => {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    if (info.breakfast !== undefined) {
      await toggleIonCheckbox(this.page, 'Frühstück', info.breakfast);
    }
  }

  async blurField(label: string) {
    await triggerIonBlur(this.page, label);
  }

  async waitForStepTitle(title: string) {
    await this.page.locator('.step-title', { hasText: title }).waitFor({ state: 'visible' });
  }
}
