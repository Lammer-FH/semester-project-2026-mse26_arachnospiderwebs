import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse, buildBookingResponse } from '../fixtures/test-data';
import { clearStorage } from '../utils/helpers';

test.describe('Booking submission', () => {
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
  const bookingResponse = buildBookingResponse({
    checkIn, checkOut,
    firstName: guestInfo.firstName,
    lastName: guestInfo.lastName,
    email: guestInfo.email,
    breakfast: guestInfo.breakfast,
  });

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

  test('API called exactly once with correct payload', async ({ page }) => {
    let callCount = 0;
    let capturedPayload: unknown = null;

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        callCount++;
        capturedPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookingResponse),
        });
      } else {
        await route.fallback();
      }
    });

    await wizardPage.confirmBooking();

    expect(callCount).toBe(1);
    expect(capturedPayload).not.toBeNull();
    const payload = capturedPayload as Record<string, unknown>;
    expect(payload.roomId).toBe(room.id);
    expect(payload.firstName).toBe(guestInfo.firstName);
    expect(payload.lastName).toBe(guestInfo.lastName);
    expect(payload.email).toBe(guestInfo.email);
    expect(payload.breakfast).toBe(guestInfo.breakfast);
  });

  test('redirects to confirmation on success', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, buildAvailabilityResponse({ checkIn, checkOut }));

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(buildBookingResponse({
            checkIn, checkOut,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            email: guestInfo.email,
          })),
        });
      } else {
        await route.fallback();
      }
    });

    await wizardPage.confirmBooking();

    await expect(wizardPage.confirmation.successHeader).toBeVisible();
    await expect(wizardPage.confirmation.successTitle).toHaveText('Buchung bestätigt!');
  });

  test('displays confirmation booking ID', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookingResponse),
        });
      } else {
        await route.fallback();
      }
    });

    await wizardPage.confirmBooking();

    const id = await wizardPage.confirmation.getBookingIdText();
    expect(id).toBe(bookingResponse.id);
  });

  test('displays confirmation total price', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookingResponse),
        });
      } else {
        await route.fallback();
      }
    });

    await wizardPage.confirmBooking();

    await expect(wizardPage.confirmation.totalPrice).toBeVisible();
  });

  test('duplicate submission is prevented while submitting', async ({ page }) => {
    let callCount = 0;

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        callCount++;
        await new Promise((r) => setTimeout(r, 200));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookingResponse),
        });
      } else {
        await route.fallback();
      }
    });

    await wizardPage.confirmButton.click();
    await page.waitForTimeout(50);
    await wizardPage.confirmButton.click({ force: true });

    await wizardPage.confirmation.waitForSuccess();

    expect(callCount).toBe(1);
  });

  test('confirm button is disabled during submission', async ({ page }) => {
    let submitResolve: () => void = () => {};

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        await new Promise<void>((resolve) => { submitResolve = resolve; });
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookingResponse),
        });
      } else {
        await route.fallback();
      }
    });

    const submitPromise = wizardPage.confirmButton.click();
    await page.waitForTimeout(100);

    await expect(wizardPage.confirmButton).toBeDisabled();

    submitResolve();
    await submitPromise;
  });
});
