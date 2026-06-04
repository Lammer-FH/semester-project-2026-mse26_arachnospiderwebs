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

const checkIn = '2026-07-15';
const checkOut = '2026-07-18';

interface PersistenceCase {
  name: string;
  info: {
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
    breakfast: boolean;
  };
}

const testCases: PersistenceCase[] = [
  {
    name: 'with breakfast',
    info: { firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com', confirmEmail: 'max@example.com', breakfast: true },
  },
  {
    name: 'without breakfast',
    info: { firstName: 'Anna', lastName: 'Schmidt', email: 'anna@test.com', confirmEmail: 'anna@test.com', breakfast: false },
  },
  {
    name: 'with special characters',
    info: { firstName: 'Hans-Günther', lastName: 'Müller', email: 'hg@web.de', confirmEmail: 'hg@web.de', breakfast: true },
  },
  {
    name: 'with long names',
    info: { firstName: 'Maria-Luise', lastName: 'von und zu Wittgenstein', email: 'maria@example.org', confirmEmail: 'maria@example.org', breakfast: false },
  },
];

test.describe('Guest info persists across button navigation', () => {
  let roomDetailPage: RoomDetailPage;
  let wizardPage: BookingWizardPage;

  test.beforeEach(async ({ page }) => {
    roomDetailPage = new RoomDetailPage(page);
    wizardPage = new BookingWizardPage(page);
    await clearAllMocks(page);
    await clearStorage(page);

    const room = buildRoom();
    await mockRoomApi(page, room);
    await mockAvailabilityApi(page);

    await roomDetailPage.goto(room.id);
    await roomDetailPage.selectDates(checkIn, checkOut);
    await roomDetailPage.checkAvailability();
    await roomDetailPage.bookNow();
  });

  for (const tc of testCases) {
    test(`values persist after forward and backward navigation: ${tc.name}`, async ({ page }) => {
      await wizardPage.fillGuestInfo(tc.info);

      const entered = await wizardPage.getGuestInfo();
      expect(entered.firstName).toBe(tc.info.firstName);
      expect(entered.breakfast).toBe(tc.info.breakfast);

      await wizardPage.goNext();
      expect(await wizardPage.getCurrentStepIndex()).toBe(1);

      await wizardPage.goBack();
      expect(await wizardPage.getCurrentStepIndex()).toBe(0);

      const afterNav = await wizardPage.getGuestInfo();
      expect(afterNav.firstName).toBe(tc.info.firstName);
      expect(afterNav.lastName).toBe(tc.info.lastName);
      expect(afterNav.email).toBe(tc.info.email);
      expect(afterNav.confirmEmail).toBe(tc.info.confirmEmail);
      expect(afterNav.breakfast).toBe(tc.info.breakfast);
    });

    test(`values persist after forward-backward-forward cycle: ${tc.name}`, async ({ page }) => {
      await wizardPage.fillGuestInfo(tc.info);

      await wizardPage.goNext();
      expect(await wizardPage.getCurrentStepIndex()).toBe(1);

      await wizardPage.goBack();
      expect(await wizardPage.getCurrentStepIndex()).toBe(0);

      await wizardPage.goNext();
      expect(await wizardPage.getCurrentStepIndex()).toBe(1);

      const reviewFirst = await wizardPage.review.getGuestFirstNameText();
      expect(reviewFirst).toBe(tc.info.firstName);
    });
  }
});
