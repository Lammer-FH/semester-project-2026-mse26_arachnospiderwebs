import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  mockCreateBookingApi,
  mockCreateBookingError,
  clearAllMocks,
} from '../fixtures/mock-responses';
import {
  buildRoom,
  buildAvailabilityResponse,
  buildBookingResponse,
} from '../fixtures/test-data';

test.describe('Booking Wizard', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';

  test.beforeEach(async ({ page }) => {
    roomDetailPage = new RoomDetailPage(page);
    wizardPage = new BookingWizardPage(page);
    await clearAllMocks(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Room Detail Page', () => {
    test('displays room information and availability check', async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);

      await expect(roomDetailPage.roomTitle).toHaveText(room.title);
      await expect(roomDetailPage.roomDescription).toHaveText(room.description);

      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();

      await expect(roomDetailPage.availabilityCard).toBeVisible();
      await expect(roomDetailPage.bookNowButton).toBeVisible();
    });

    test('hides book button when room is unavailable', async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ available: false });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();

      await expect(roomDetailPage.unavailabilityCard).toBeVisible();
      await expect(roomDetailPage.bookNowButton).not.toBeVisible();
    });

    test('shows error message on availability check failure', async ({ page }) => {
      const room = buildRoom();

      await mockRoomApi(page, room);
      await page.route('**/api/rooms/1/availability**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Serverfehler' }),
        });
      });

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();

      await expect(roomDetailPage.errorText).toBeVisible();
    });

    test('shows loading spinner while room is being fetched', async ({ page }) => {
      const room = buildRoom();
      await mockRoomApi(page, room, 500);

      await page.goto(`/rooms/${room.id}`);

      await expect(roomDetailPage.loadingSpinner).toBeVisible();
      await page.waitForLoadState('networkidle');
      await expect(roomDetailPage.loadingSpinner).not.toBeVisible();
      await expect(roomDetailPage.roomTitle).toBeVisible();
    });

    test('navigates to booking wizard on "Jetzt buchen"', async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();

      await expect(page).toHaveURL(/\/booking/);
      await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
    });
  });

  test.describe('Guest Information Step', () => {
    test.beforeEach(async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();
    });

    test('shows guest info form on first step', async ({ page }) => {
      await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
      await expect(wizardPage.stepDescription).toBeVisible();
      await expect(wizardPage.backButton).not.toBeVisible();
      await expect(wizardPage.nextButton).toBeDisabled();
      await expect(wizardPage.confirmButton).not.toBeVisible();
    });

    test('enables next button when valid guest info is filled', async ({ page }) => {
      await wizardPage.fillGuestInfo({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        confirmEmail: 'max@example.com',
      });

      await expect(wizardPage.nextButton).toBeEnabled();
    });

    test('proceeds to review step on next', async ({ page }) => {
      await wizardPage.fillGuestInfo({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        confirmEmail: 'max@example.com',
      });

      await wizardPage.goNext();

      await expect(wizardPage.review.roomTitle).toBeVisible();
    });
  });

  test.describe('Review Step', () => {
    test.beforeEach(async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();
      await wizardPage.fillGuestInfo({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        confirmEmail: 'max@example.com',
      });
      await wizardPage.goNext();
    });

    test('displays all booking details on review step', async ({ page }) => {
      await expect(wizardPage.stepTitle).toHaveText('Buchung überprüfen');

      await expect(wizardPage.review.checkIn).toBeVisible();
      await expect(wizardPage.review.checkOut).toBeVisible();
      await expect(wizardPage.review.roomTitle).toBeVisible();
      await expect(wizardPage.review.totalPrice).toBeVisible();
    });

    test('shows guest information in review', async ({ page }) => {
      await expect(wizardPage.review.guestFirstName).toBeVisible();
      await expect(wizardPage.review.guestLastName).toBeVisible();
      await expect(wizardPage.review.guestEmail).toBeVisible();
      await expect(wizardPage.review.breakfast).toBeVisible();
    });

    test('allows going back to edit guest info', async ({ page }) => {
      await wizardPage.review.editGuest();

      await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
    });

    test('shows confirm button on review step', async ({ page }) => {
      await expect(wizardPage.confirmButton).toBeVisible();
      await expect(wizardPage.nextButton).not.toBeVisible();
    });
  });

  test.describe('Booking Submission', () => {
    test.beforeEach(async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();
      await wizardPage.fillGuestInfo({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        confirmEmail: 'max@example.com',
      });
      await wizardPage.goNext();
    });

    test('shows loading state while submitting', async ({ page }) => {
      const bookingResponse = buildBookingResponse();
      await mockCreateBookingApi(page, bookingResponse, 200, 1000);

      await wizardPage.confirmButton.click();

      await expect(wizardPage.confirmation.loadingSection).toBeVisible();
    });

    test('confirms booking on successful submission', async ({ page }) => {
      const bookingResponse = buildBookingResponse();
      await mockCreateBookingApi(page, bookingResponse);

      await wizardPage.confirmBooking();

      await expect(wizardPage.confirmation.successHeader).toBeVisible();
      await expect(wizardPage.confirmation.successTitle).toHaveText('Buchung bestätigt!');
    });

    test('displays booking ID on success', async ({ page }) => {
      const bookingResponse = buildBookingResponse();
      await mockCreateBookingApi(page, bookingResponse);

      await wizardPage.confirmBooking();

      const id = await wizardPage.confirmation.getBookingIdText();
      expect(id).toBe(bookingResponse.id);
    });

    test('displays total price on confirmation', async ({ page }) => {
      const bookingResponse = buildBookingResponse();
      await mockCreateBookingApi(page, bookingResponse);

      await wizardPage.confirmBooking();

      await expect(wizardPage.confirmation.totalPrice).toBeVisible();
    });

    test('shows error when booking submission fails', async ({ page }) => {
      await mockCreateBookingError(page, 500);

      await wizardPage.confirmBooking();

      await expect(wizardPage.confirmation.errorHeader).toBeVisible();
      await expect(wizardPage.confirmation.errorTitle).toHaveText('Buchung fehlgeschlagen');
    });

    test('allows retry after failed submission', async ({ page }) => {
      await mockCreateBookingError(page, 500);

      await wizardPage.confirmBooking();

      await expect(wizardPage.confirmation.retryButton).toBeVisible();
    });

    test('recovers on retry after error', async ({ page }) => {
      const bookingResponse = buildBookingResponse();

      await page.route('**/api/bookings', async (route) => {
        if (route.request().method() !== 'POST') {
          await route.fallback();
          return;
        }
        const body = route.request().postDataJSON();
        if (body && body.firstName === 'Max') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(bookingResponse),
          });
        } else {
          await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({}) });
        }
      });

      await wizardPage.confirmBooking();
      await expect(wizardPage.confirmation.errorHeader).toBeVisible();

      await wizardPage.confirmation.retry();

      await expect(wizardPage.confirmation.successHeader).toBeVisible();
    });

    test('shows validation errors on 400 response', async ({ page }) => {
      await mockCreateBookingError(page, 400, {
        message: 'Einige Angaben sind ungültig.',
        errors: { email: ['Ungültiges Format.'] },
      });

      await wizardPage.confirmBooking();

      await expect(wizardPage.confirmation.errorHeader).toBeVisible();
      await expect(wizardPage.confirmation.errorMessage).toContainText('ungültig');
    });
  });

  test.describe('Navigation', () => {
    test('returns to rooms when no draft exists', async ({ page }) => {
      await page.goto('/booking');
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('Keine Buchungsdaten gefunden.')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Zurück zur Zimmerübersicht' })).toBeVisible();
    });

    test('preserves draft after browser navigation', async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();

      await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');

      const draftCheckIn = await page.evaluate(() => {
        const raw = localStorage.getItem('hotel_booking_draft');
        return raw ? JSON.parse(raw).checkIn : null;
      });
      expect(draftCheckIn).toBe(checkIn);
    });

    test('wizard progress updates as steps advance', async ({ page }) => {
      const room = buildRoom();
      const availability = buildAvailabilityResponse({ checkIn, checkOut });

      await mockRoomApi(page, room);
      await mockAvailabilityApi(page, availability);

      await roomDetailPage.goto(room.id);
      await roomDetailPage.selectDates(checkIn, checkOut);
      await roomDetailPage.checkAvailability();
      await roomDetailPage.bookNow();

      expect(await wizardPage.getCurrentStepIndex()).toBe(0);

      await wizardPage.fillGuestInfo({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        confirmEmail: 'max@example.com',
      });
      await wizardPage.goNext();

      expect(await wizardPage.getCurrentStepIndex()).toBe(1);
    });
  });
});
