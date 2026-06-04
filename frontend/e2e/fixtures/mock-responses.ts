import type { Page } from '@playwright/test';
import type { Room, AvailabilityResponse } from '../../src/types/room';
import type { BookingResponse } from '../../src/types/booking';
import { buildRoom, buildAvailabilityResponse, buildBookingResponse } from './test-data';

export async function mockRoomApi(
  page: Page,
  room?: Room,
  delay = 0,
) {
  const data = room ?? buildRoom();
  await page.route(`**/api/rooms/${data.id}`, async (route) => {
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

export async function mockRoomListApi(
  page: Page,
  rooms?: Room[],
) {
  const data = rooms ?? [buildRoom()];
  await page.route('**/api/rooms', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        content: data,
        totalElements: data.length,
        totalPages: 1,
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }),
    });
  });
}

export async function mockAvailabilityApi(
  page: Page,
  availability?: AvailabilityResponse,
  delay = 0,
) {
  const data = availability ?? buildAvailabilityResponse();
  await page.route(`**/api/rooms/${data.roomId}/availability**`, async (route) => {
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

export async function mockCreateBookingApi(
  page: Page,
  bookingResponse?: BookingResponse,
  statusCode = 200,
  delay = 0,
) {
  const data = bookingResponse ?? buildBookingResponse();
  await page.route('**/api/bookings', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }
    if (delay) {
      await new Promise((r) => setTimeout(r, delay));
    }
    await route.fulfill({ status: statusCode, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

export async function mockCreateBookingError(
  page: Page,
  statusCode: number,
  body?: Record<string, unknown>,
) {
  const defaultBody = {
    message: statusCode === 400
      ? 'Einige Angaben sind ungültig.'
      : statusCode === 422
        ? 'Validierung fehlgeschlagen.'
        : 'Ein Serverfehler ist aufgetreten.',
    errors: statusCode === 400 ? { email: ['Ungültiges Format.'] } : undefined,
  };
  await page.route('**/api/bookings', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(body ?? defaultBody),
    });
  });
}

export async function mockGetBookingApi(
  page: Page,
  bookingResponse?: BookingResponse,
) {
  const data = bookingResponse ?? buildBookingResponse();
  await page.route(`**/api/bookings/${data.id}`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

export async function clearAllMocks(page: Page) {
  await page.unroute('**/api/**');
}
