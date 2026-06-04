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

test.describe('Booking API failures', () => {
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
    breakfast: false,
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

  test('shows error message on validation error (400)', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Einige Angaben sind ungültig.',
          errors: { email: ['Ungültiges Format.'] },
        }),
      });
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await expect(wizardPage.confirmation.errorHeader).toBeVisible();
    await expect(wizardPage.confirmation.errorMessage).toContainText('ungültig');
  });

  test('shows error message on server error (500)', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Interner Serverfehler.' }),
      });
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await expect(wizardPage.confirmation.errorHeader).toBeVisible();
    await expect(wizardPage.confirmation.errorMessage).toContainText('Serverfehler');
  });

  test('shows error message on network failure', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      await route.abort('connectionrefused');
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await expect(wizardPage.confirmation.errorHeader).toBeVisible();
  });

  test('user remains on review step after API failure', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      await route.abort('connectionrefused');
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    expect(await wizardPage.getCurrentStepIndex()).toBe(1);
    await expect(wizardPage.review.roomTitle).toBeVisible();
  });

  test('all entered values remain intact after API failure', async ({ page }) => {
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      await route.abort('connectionrefused');
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
    await expect(wizardPage.review.guestLastName).toHaveText(guestInfo.lastName);
    await expect(wizardPage.review.guestEmail).toHaveText(guestInfo.email);
    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
  });

  test('user can retry without re-entering data after validation error', async ({ page }) => {
    let callCount = 0;

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      callCount++;
      if (callCount === 1) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Fehler' }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
          id: 'BK-RETRY',
          room: { id: room.id, title: room.title, description: room.description, imageUrl: room.imageUrl, pricePerNight: room.pricePerNight, extras: room.extras, availability: null },
          checkIn, checkOut, nights: 3, firstName: guestInfo.firstName, lastName: guestInfo.lastName, email: guestInfo.email, totalPrice: 597, breakfast: guestInfo.breakfast, status: 'CONFIRMED', createdAt: new Date().toISOString(),
        }) });
      }
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await wizardPage.confirmation.retry();
    await wizardPage.confirmation.waitForSuccess();

    await expect(wizardPage.confirmation.successHeader).toBeVisible();
    expect(callCount).toBe(2);
  });

  test('user can retry without re-entering data after server error', async ({ page }) => {
    let callCount = 0;

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      callCount++;
      if (callCount === 1) {
        await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Serverfehler' }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
          id: 'BK-RETRY-500',
          room: { id: room.id, title: room.title, description: room.description, imageUrl: room.imageUrl, pricePerNight: room.pricePerNight, extras: room.extras, availability: null },
          checkIn, checkOut, nights: 3, firstName: guestInfo.firstName, lastName: guestInfo.lastName, email: guestInfo.email, totalPrice: 597, breakfast: guestInfo.breakfast, status: 'CONFIRMED', createdAt: new Date().toISOString(),
        }) });
      }
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await wizardPage.confirmation.retry();
    await wizardPage.confirmation.waitForSuccess();

    await expect(wizardPage.confirmation.successHeader).toBeVisible();
    expect(callCount).toBe(2);
  });

  test('all entered values intact after network failure and retry', async ({ page }) => {
    let callCount = 0;

    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() !== 'POST') { await route.fallback(); return; }
      callCount++;
      if (callCount === 1) {
        await route.abort('connectionrefused');
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
          id: 'BK-NET-RETRY',
          room: { id: room.id, title: room.title, description: room.description, imageUrl: room.imageUrl, pricePerNight: room.pricePerNight, extras: room.extras, availability: null },
          checkIn, checkOut, nights: 3, firstName: guestInfo.firstName, lastName: guestInfo.lastName, email: guestInfo.email, totalPrice: 597, breakfast: guestInfo.breakfast, status: 'CONFIRMED', createdAt: new Date().toISOString(),
        }) });
      }
    });

    await wizardPage.confirmBooking();
    await wizardPage.confirmation.waitForError();

    await wizardPage.confirmation.retry();
    await wizardPage.confirmation.waitForSuccess();

    await expect(wizardPage.confirmation.successHeader).toBeVisible();
    expect(callCount).toBe(2);
  });
});
