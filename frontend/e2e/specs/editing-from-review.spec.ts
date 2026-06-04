import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse } from '../fixtures/test-data';
import { clearStorage, fillIonInputByLabel, toggleIonCheckbox } from '../utils/helpers';

test.describe('Editing from Review step', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';
  const originalInfo = {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    confirmEmail: 'max@example.com',
    breakfast: false,
  };

  test.beforeEach(async ({ page }) => {
    roomDetailPage = new RoomDetailPage(page);
    wizardPage = new BookingWizardPage(page);
    await clearAllMocks(page);
    await clearStorage(page);

    const room = buildRoom();
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, buildAvailabilityResponse({ checkIn, checkOut }));

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(originalInfo);
    await wizardPage.goNext();
  });

  test('clicking edit guest returns to step 0', async ({ page }) => {
    await wizardPage.review.editGuest();
    expect(await wizardPage.getCurrentStepIndex()).toBe(0);
  });

  test('original values are editable after returning from review', async ({ page }) => {
    await wizardPage.review.editGuest();

    const newFirstName = 'Maximilian';
    const newBreakfast = true;
    await fillIonInputByLabel(page, 'Vorname', newFirstName);
    await toggleIonCheckbox(page, 'Frühstück', newBreakfast);
    await wizardPage.goNext();

    const firstName = await wizardPage.review.getGuestFirstNameText();
    expect(firstName).toBe(newFirstName);

    const breakfast = await wizardPage.review.getBreakfastText();
    expect(breakfast).toBe('Ja');
  });

  test('old values are removed after edit', async ({ page }) => {
    await wizardPage.review.editGuest();

    const oldFirstName = originalInfo.firstName;
    await fillIonInputByLabel(page, 'Vorname', 'ChangedName');
    await wizardPage.goNext();

    const text = await wizardPage.review.getGuestFirstNameText();
    expect(text).not.toBe(oldFirstName);
    expect(text).toBe('ChangedName');
  });

  test('state is consistent after editing', async ({ page }) => {
    await wizardPage.review.editGuest();
    await fillIonInputByLabel(page, 'Vorname', 'ChangedName');
    await wizardPage.goNext();

    await expect(wizardPage.review.guestFirstName).toHaveText('ChangedName');
    await expect(wizardPage.review.guestLastName).toHaveText(originalInfo.lastName);
    await expect(wizardPage.review.guestEmail).toHaveText(originalInfo.email);
  });

  test('no duplicate state entries after edit cycle', async ({ page }) => {
    await wizardPage.review.editGuest();
    await wizardPage.goNext();

    await wizardPage.review.editGuest();
    await wizardPage.goNext();

    const firstName = await wizardPage.review.getGuestFirstNameText();
    expect(firstName).toBe(originalInfo.firstName);
  });
});
