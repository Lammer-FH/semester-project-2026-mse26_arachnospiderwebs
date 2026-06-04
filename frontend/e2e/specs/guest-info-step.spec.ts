import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse } from '../fixtures/test-data';
import { clearStorage, fillIonInputByLabel, triggerIonBlur } from '../utils/helpers';

test.describe('Guest Information Step - Validation', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';

  test.beforeEach(async ({ page }) => {
    roomDetailPage = new RoomDetailPage(page);
    wizardPage = new BookingWizardPage(page);
    await clearAllMocks(page);
    await clearStorage(page);

    const room = buildRoom();
    const availability = buildAvailabilityResponse({ checkIn, checkOut });
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();

    await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
  });

  test('next button is disabled when form is empty', async ({ page }) => {
    await expect(wizardPage.nextButton).toBeDisabled();
  });

  test('next button is disabled when first name is missing', async ({ page }) => {
    await fillIonInputByLabel(page, 'Nachname', 'Mustermann');
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'max@example.com');

    await expect(wizardPage.nextButton).toBeDisabled();
  });

  test('next button is disabled when last name is missing', async ({ page }) => {
    await fillIonInputByLabel(page, 'Vorname', 'Max');
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'max@example.com');

    await expect(wizardPage.nextButton).toBeDisabled();
  });

  test('next button is disabled when email is missing', async ({ page }) => {
    await fillIonInputByLabel(page, 'Vorname', 'Max');
    await fillIonInputByLabel(page, 'Nachname', 'Mustermann');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'max@example.com');

    await expect(wizardPage.nextButton).toBeDisabled();
  });

  test('next button is disabled when confirm email is missing', async ({ page }) => {
    await fillIonInputByLabel(page, 'Vorname', 'Max');
    await fillIonInputByLabel(page, 'Nachname', 'Mustermann');
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');

    await expect(wizardPage.nextButton).toBeDisabled();
  });

  test('next button becomes enabled when all fields are valid', async ({ page }) => {
    await wizardPage.fillGuestInfo({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      confirmEmail: 'max@example.com',
    });

    await expect(wizardPage.nextButton).toBeEnabled();
  });

  test('shows required validation for first name on blur', async ({ page }) => {
    await wizardPage.blurField('Vorname');

    await expect(wizardPage.firstNameRequiredError).toBeVisible();
  });

  test('shows required validation for last name on blur', async ({ page }) => {
    await wizardPage.blurField('Nachname');

    await expect(wizardPage.lastNameRequiredError).toBeVisible();
  });

  test('shows validation message for empty email on blur', async ({ page }) => {
    await triggerIonBlur(page, 'E-Mail');

    await expect(wizardPage.emailRequiredError).toBeVisible();
  });

  test('shows validation message for empty confirm email on blur', async ({ page }) => {
    await triggerIonBlur(page, 'E-Mail bestätigen');

    await expect(wizardPage.confirmEmailRequiredError).toBeVisible();
  });

  test('shows format error for invalid email', async ({ page }) => {
    await fillIonInputByLabel(page, 'E-Mail', 'invalid-text');

    await expect(wizardPage.emailFormatError).toBeVisible();
  });

  test('shows mismatch error when confirm email differs', async ({ page }) => {
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'other@example.com');

    await expect(wizardPage.confirmEmailMismatchError).toBeVisible();
  });

  test('validation errors disappear when required field is filled', async ({ page }) => {
    await wizardPage.blurField('Vorname');
    await expect(wizardPage.firstNameRequiredError).toBeVisible();

    await fillIonInputByLabel(page, 'Vorname', 'Max');
    await expect(wizardPage.firstNameRequiredError).not.toBeVisible();
  });

  test('validation errors disappear when email is corrected', async ({ page }) => {
    await fillIonInputByLabel(page, 'E-Mail', 'invalid');
    await expect(wizardPage.emailFormatError).toBeVisible();

    await fillIonInputByLabel(page, 'E-Mail', 'valid@example.com');
    await expect(wizardPage.emailFormatError).not.toBeVisible();
  });

  test('mismatch error disappears when confirm email matches', async ({ page }) => {
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'wrong@example.com');
    await expect(wizardPage.confirmEmailMismatchError).toBeVisible();

    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'max@example.com');
    await expect(wizardPage.confirmEmailMismatchError).not.toBeVisible();
  });

  test('next button disabled after mismatch error is corrected', async ({ page }) => {
    await fillIonInputByLabel(page, 'Vorname', 'Max');
    await fillIonInputByLabel(page, 'Nachname', 'Mustermann');
    await fillIonInputByLabel(page, 'E-Mail', 'max@example.com');
    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'wrong@example.com');

    await expect(wizardPage.nextButton).toBeDisabled();

    await fillIonInputByLabel(page, 'E-Mail bestätigen', 'max@example.com');

    await expect(wizardPage.nextButton).toBeEnabled();
  });

  test('valid form proceeds to review step', async ({ page }) => {
    await wizardPage.fillGuestInfo({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      confirmEmail: 'max@example.com',
    });

    await expect(wizardPage.nextButton).toBeEnabled();

    await wizardPage.goNext();

    await expect(wizardPage.stepTitle).toHaveText('Buchung überprüfen');
  });

  test('multiple validation errors display simultaneously', async ({ page }) => {
    await wizardPage.blurField('Vorname');
    await wizardPage.blurField('Nachname');
    await triggerIonBlur(page, 'E-Mail');
    await triggerIonBlur(page, 'E-Mail bestätigen');

    expect(await wizardPage.getValidationErrorCount()).toBe(4);
  });

  test('all errors clear when form is correctly filled', async ({ page }) => {
    await wizardPage.blurField('Vorname');
    await wizardPage.blurField('Nachname');
    await triggerIonBlur(page, 'E-Mail');
    await triggerIonBlur(page, 'E-Mail bestätigen');

    expect(await wizardPage.getValidationErrorCount()).toBe(4);

    await wizardPage.fillGuestInfo({
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      confirmEmail: 'max@example.com',
    });

    expect(await wizardPage.getValidationErrorCount()).toBe(0);
  });
});
