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

test.describe('Review Step - value display', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  const room = buildRoom();
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

    await mockRoomApi(page, room);
    await mockAvailabilityApi(page, buildAvailabilityResponse({ checkIn, checkOut }));

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
    await wizardPage.fillGuestInfo(guestInfo);
    await wizardPage.goNext();
  });

  test('displays guest first name from wizard input', async ({ page }) => {
    const text = await wizardPage.review.getGuestFirstNameText();
    expect(text).toBe(guestInfo.firstName);
  });

  test('displays guest last name from wizard input', async ({ page }) => {
    const text = await wizardPage.review.getGuestLastNameText();
    expect(text).toBe(guestInfo.lastName);
  });

  test('displays guest email from wizard input', async ({ page }) => {
    const text = await wizardPage.review.getGuestEmailText();
    expect(text).toBe(guestInfo.email);
  });

  test('displays breakfast selection from wizard input', async ({ page }) => {
    const text = await wizardPage.review.getBreakfastText();
    expect(text).toBe('Ja');
  });

  test('displays breakfast "Nein" when not selected', async ({ page }) => {
    await wizardPage.goBack();
    await wizardPage.waitForStepTitle('Gastinformationen');
    await wizardPage.fillGuestInfo({ ...guestInfo, breakfast: false });
    await wizardPage.goNext();

    const text = await wizardPage.review.getBreakfastText();
    expect(text).toBe('Nein');
  });

  test('displays arrival date from booking draft', async ({ page }) => {
    const text = await wizardPage.review.getCheckInText();
    expect(text).toContain('15');
  });

  test('displays departure date from booking draft', async ({ page }) => {
    const text = await wizardPage.review.getCheckOutText();
    expect(text).toContain('18');
  });

  test('displays number of nights', async ({ page }) => {
    const text = await wizardPage.review.getNightsText();
    expect(text).toBe('3');
  });

  test('displays room title from booking draft', async ({ page }) => {
    const text = await wizardPage.review.getRoomTitleText();
    expect(text).toBe(room.title);
  });

  test('displays total price from booking draft', async ({ page }) => {
    await expect(wizardPage.review.totalPrice).toBeVisible();
    const text = await wizardPage.review.getTotalPriceText();
    expect(text).toContain('597');
  });

  test('all displayed values match original input', async ({ page }) => {
    await expect(wizardPage.review.guestFirstName).toHaveText(guestInfo.firstName);
    await expect(wizardPage.review.guestLastName).toHaveText(guestInfo.lastName);
    await expect(wizardPage.review.guestEmail).toHaveText(guestInfo.email);
    await expect(wizardPage.review.breakfast).toHaveText('Ja');

    await expect(wizardPage.review.roomTitle).toHaveText(room.title);
    await expect(wizardPage.review.totalPrice).toBeVisible();
  });
});
