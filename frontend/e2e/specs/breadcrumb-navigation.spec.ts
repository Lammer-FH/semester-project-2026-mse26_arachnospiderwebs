import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse } from '../fixtures/test-data';
import { clearStorage } from '../utils/helpers';

test.describe('Breadcrumb navigation', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';
  const guestInfo = {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    confirmEmail: 'max@example.com',
    breakfast: true,
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
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();
  });

  test('clicking breadcrumb step 0 navigates back to guest info', async ({ page }) => {
    expect(await wizardPage.getCurrentStepIndex()).toBe(1);

    await wizardPage.clickBreadcrumb(0);

    expect(await wizardPage.getCurrentStepIndex()).toBe(0);
    await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
  });

  test('values preserved after breadcrumb navigation back', async ({ page }) => {
    await wizardPage.clickBreadcrumb(0);

    const after = await wizardPage.getGuestInfo();
    expect(after.firstName).toBe(guestInfo.firstName);
    expect(after.lastName).toBe(guestInfo.lastName);
    expect(after.email).toBe(guestInfo.email);
    expect(after.breakfast).toBe(guestInfo.breakfast);
  });

  test('review values correct after breadcrumb round-trip', async ({ page }) => {
    await wizardPage.clickBreadcrumb(0);
    await wizardPage.waitForStepTitle('Gastinformationen');
    await wizardPage.goNext();

    expect(await wizardPage.getCurrentStepIndex()).toBe(1);
    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
  });

  test('repeated breadcrumb navigation does not duplicate state', async ({ page }) => {
    await wizardPage.clickBreadcrumb(0);
    await wizardPage.waitForStepTitle('Gastinformationen');
    await wizardPage.goNext();
    await wizardPage.clickBreadcrumb(0);
    await wizardPage.waitForStepTitle('Gastinformationen');
    await wizardPage.goNext();

    expect(await wizardPage.getCurrentStepIndex()).toBe(1);
    const values = await wizardPage.getGuestInfo();

    expect(values.firstName).toBe(guestInfo.firstName);
    expect(values.lastName).toBe(guestInfo.lastName);
    expect(values.email).toBe(guestInfo.email);
    expect(values.breakfast).toBe(guestInfo.breakfast);
  });

  test('cannot click future breadcrumb step', async ({ page }) => {
    await wizardPage.clickBreadcrumb(2);
    expect(await wizardPage.getCurrentStepIndex()).toBe(1);
  });
});
