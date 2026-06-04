import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  mockCreateBookingApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse, buildBookingResponse } from '../fixtures/test-data';
import { clearStorage, readBookingDraft } from '../utils/helpers';

test.describe('Room info persistence throughout the wizard', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';
  const room = buildRoom();
  const availability = buildAvailabilityResponse({ checkIn, checkOut });
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
  });

  test('room ID is set in draft when booking starts', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();

    const draft = await readBookingDraft(page);
    expect(draft!.roomId).toBe(room.id);
    expect(draft!.roomTitle).toBe(room.title);
    expect(draft!.roomDescription).toBe(room.description);
    expect(draft!.pricePerNight).toBe(room.pricePerNight);
  });

  test('room title on review matches selected room', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();

    await expect(wizardPage.review.roomTitle).toHaveText(room.title);
  });

  test('room info unchanged after refresh', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(wizardPage.review.roomTitle).toHaveText(room.title);

    const draft = await readBookingDraft(page);
    expect(draft!.roomId).toBe(room.id);
    expect(draft!.checkIn).toBe(checkIn);
    expect(draft!.checkOut).toBe(checkOut);
  });

  test('room info unchanged after repeated navigation', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();
    await wizardPage.goBack();
    await wizardPage.goNext();
    await wizardPage.clickBreadcrumb(0);
    await wizardPage.goNext();

    await expect(wizardPage.review.roomTitle).toHaveText(room.title);
  });

  test('booking request contains correct room reference', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    let capturedRequest: unknown = null;
    await page.route('**/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        capturedRequest = route.request().postDataJSON();
      }
      const resp = buildBookingResponse();
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(resp) });
    });

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();
    await wizardPage.confirmBooking();

    expect(capturedRequest).not.toBeNull();
    const req = capturedRequest as Record<string, unknown>;
    expect(req.roomId).toBe(room.id);
    expect(req.checkIn).toBe(checkIn);
    expect(req.checkOut).toBe(checkOut);
    expect(req.firstName).toBe(guestInfo.firstName);
    expect(req.lastName).toBe(guestInfo.lastName);
    expect(req.email).toBe(guestInfo.email);
  });

  test('room prices in draft are consistent after refresh', async ({ page }) => {
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();

    const draftBefore = await readBookingDraft(page);
    expect(draftBefore!.pricePerNight).toBe(room.pricePerNight);
    expect(draftBefore!.totalPrice).toBe(availability.totalPrice);

    await page.reload();
    await page.waitForLoadState('networkidle');

    const draftAfter = await readBookingDraft(page);
    expect(draftAfter!.pricePerNight).toBe(room.pricePerNight);
    expect(draftAfter!.totalPrice).toBe(availability.totalPrice);
  });
});
