import { test, expect } from '@playwright/test';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { BookingWizardPage } from '../pages/BookingWizardPage';
import {
  mockRoomApi,
  mockAvailabilityApi,
  mockCreateBookingApi,
  clearAllMocks,
} from '../fixtures/mock-responses';
import { buildRoom, buildAvailabilityResponse } from '../fixtures/test-data';
import { readBookingDraft, clearStorage } from '../utils/helpers';

test.describe('Entering the booking flow', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const checkIn = '2026-07-15';
  const checkOut = '2026-07-18';
  const nights = 3;
  const totalPrice = 597;

  test.beforeEach(async ({ page }) => {
    roomDetailPage = new RoomDetailPage(page);
    wizardPage = new BookingWizardPage(page);
    await clearAllMocks(page);
    await clearStorage(page);
  });

  test('happy path: from room detail to booking wizard with store populated', async ({ page }) => {
    const room = buildRoom();
    const availability = buildAvailabilityResponse({ checkIn, checkOut, nights, totalPrice });

    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, availability);
    await mockCreateBookingApi(page);

    await roomDetailPage.goto(room.id);

    await expect(roomDetailPage.roomTitle).toHaveText(room.title);
    await expect(roomDetailPage.roomDescription).toHaveText(room.description);

    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();

    await expect(roomDetailPage.availabilityCard).toContainText(
      `${nights} Nächte`,
    );

    await expect(roomDetailPage.bookNowButton).toBeVisible();

    await roomDetailPage.bookNow();

    await expect(page).toHaveURL(/\/booking$/);

    await expect(wizardPage.stepTitle).toHaveText('Gastinformationen');
    await expect(wizardPage.stepDescription).toBeVisible();
    expect(await wizardPage.getCurrentStepIndex()).toBe(0);

    const draft = await readBookingDraft(page);
    expect(draft).not.toBeNull();

    expect(draft!.roomId).toBe(room.id);
    expect(draft!.roomTitle).toBe(room.title);
    expect(draft!.roomDescription).toBe(room.description);
    expect(draft!.pricePerNight).toBe(room.pricePerNight);

    expect(draft!.checkIn).toBe(checkIn);
    expect(draft!.checkOut).toBe(checkOut);
    expect(draft!.nights).toBe(nights);
    expect(draft!.totalPrice).toBe(totalPrice);
  });
});
