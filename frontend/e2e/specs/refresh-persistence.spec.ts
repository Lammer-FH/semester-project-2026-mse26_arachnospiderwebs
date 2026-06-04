import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse } from '../fixtures/test-data';
import { clearStorage, readBookingDraft } from '../utils/helpers';

test.describe('Refresh persistence', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';
  const room = buildRoom();
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

    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, buildAvailabilityResponse({ checkIn, checkOut }));

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();
  });

  test('draft survives browser refresh on review step', async ({ page }) => {
    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(await wizardPage.getCurrentStepIndex()).toBe(1);

    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
    await expect(wizardPage.review.guestLastName).toHaveText(guestInfo.lastName);
    await expect(wizardPage.review.guestEmail).toHaveText(guestInfo.email);
  });

  test('room info persists after refresh', async ({ page }) => {
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(wizardPage.review.roomTitle).toHaveText(room.title);
  });

  test('booking dates persist after refresh', async ({ page }) => {
    await page.reload();
    await page.waitForLoadState('networkidle');

    const checkInText = await wizardPage.review.getCheckInText();
    expect(checkInText).toContain('15');

    const checkOutText = await wizardPage.review.getCheckOutText();
    expect(checkOutText).toContain('18');
  });

  test('user can continue booking after refresh', async ({ page }) => {
    await page.reload();
    await page.waitForLoadState('networkidle');

    await wizardPage.goBack();
    await wizardPage.waitForStepTitle('Gastinformationen');
    expect(await wizardPage.getCurrentStepIndex()).toBe(0);

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(await wizardPage.getCurrentStepIndex()).toBe(0);

    const values = await wizardPage.getGuestInfo();
    expect(values.firstName).toBe(guestInfo.firstName);
    expect(values.lastName).toBe(guestInfo.lastName);
    expect(values.email).toBe(guestInfo.email);
    expect(values.breakfast).toBe(guestInfo.breakfast);
  });

  test('draft stored in localStorage before refresh', async ({ page }) => {
    const draft = await readBookingDraft(page);
    expect(draft).not.toBeNull();
    expect(draft!.roomId).toBe(room.id);
    expect(draft!.checkIn).toBe(checkIn);
    expect(draft!.checkOut).toBe(checkOut);
  });

  test('wizard state preserved after refresh on guest info step', async ({ page }) => {
    await wizardPage.goBack();
    await wizardPage.waitForStepTitle('Gastinformationen');
    expect(await wizardPage.getCurrentStepIndex()).toBe(0);

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(await wizardPage.getCurrentStepIndex()).toBe(0);

    const values = await wizardPage.getGuestInfo();
    expect(values.firstName).toBe(guestInfo.firstName);
    expect(values.lastName).toBe(guestInfo.lastName);
    expect(values.email).toBe(guestInfo.email);
    expect(values.breakfast).toBe(guestInfo.breakfast);
  });
});
