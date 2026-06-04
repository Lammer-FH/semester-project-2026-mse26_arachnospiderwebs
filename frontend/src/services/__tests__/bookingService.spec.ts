import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';
import { bookingService } from '../bookingService';
import type { BookingDraftInput } from '../bookingService';
import type { BookingResponse, CreateBookingRequest } from '@/types/booking';

vi.mock('../bookingApi', () => ({
  bookingApi: {
    createBooking: vi.fn(),
  },
}));

import { bookingApi } from '../bookingApi';

const mockCreateBooking = vi.mocked(bookingApi.createBooking);

const validDraft: BookingDraftInput = {
  roomId: 1,
  checkIn: '2026-07-01',
  checkOut: '2026-07-05',
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.com',
  breakfast: true,
};

const sampleResponse: BookingResponse = {
  id: 'bk-123',
  room: {
    id: 1,
    title: 'Deluxe Suite',
    description: 'A nice room',
    imageUrl: 'https://example.com/img.jpg',
    pricePerNight: 149,
    extras: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
    availability: null,
  },
  checkIn: '2026-07-01',
  checkOut: '2026-07-05',
  nights: 4,
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.com',
  totalPrice: 596,
  breakfast: true,
  status: 'CONFIRMED',
  createdAt: '2026-07-01T12:00:00Z',
};

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBooking', () => {
    it('returns success result when API call succeeds', async () => {
      mockCreateBooking.mockResolvedValueOnce(sampleResponse);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(sampleResponse);
        expect(result.data.id).toBe('bk-123');
      }

      expect(mockCreateBooking).toHaveBeenCalledTimes(1);
      const request = mockCreateBooking.mock.calls[0][0] as CreateBookingRequest;
      expect(request.roomId).toBe(1);
      expect(request.firstName).toBe('Max');
      expect(request.email).toBe('max@example.com');
      expect(request.breakfast).toBe(true);
    });

    it('trims whitespace from name and email fields', async () => {
      mockCreateBooking.mockResolvedValueOnce(sampleResponse);

      await bookingService.createBooking({
        ...validDraft,
        firstName: '  Max  ',
        lastName: '  Mustermann  ',
        email: '  max@example.com  ',
      });

      const request = mockCreateBooking.mock.calls[0][0] as CreateBookingRequest;
      expect(request.firstName).toBe('Max');
      expect(request.lastName).toBe('Mustermann');
      expect(request.email).toBe('max@example.com');
    });

    it('returns validation error on 400 with field errors', async () => {
      const responseData = {
        message: 'Validierungsfehler',
        errors: {
          email: ['Die E-Mail-Adresse ist bereits vergeben.'],
          firstName: ['Der Vorname darf nicht leer sein.'],
        },
      };

      const axiosError = new AxiosError(
        'Bad Request',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          status: 400,
          data: responseData,
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
      );

      mockCreateBooking.mockRejectedValueOnce(axiosError);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('VALIDATION');
        expect(result.error.message).toBe('Validierungsfehler');
        expect(result.error.details).toBeDefined();
        expect(result.error.details).toHaveLength(2);
        expect(result.error.details![0].field).toBe('email');
        expect(result.error.details![0].message).toBe(
          'Die E-Mail-Adresse ist bereits vergeben.',
        );
        expect(result.error.details![1].field).toBe('firstName');
      }
    });

    it('returns validation error on 422 without field details', async () => {
      const axiosError = new AxiosError(
        'Unprocessable Entity',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          status: 422,
          data: { message: 'Einige Angaben sind ungueltig.' },
          statusText: 'Unprocessable Entity',
          headers: {},
          config: {} as any,
        },
      );

      mockCreateBooking.mockRejectedValueOnce(axiosError);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('VALIDATION');
        expect(result.error.message).toBe('Einige Angaben sind ungueltig.');
        expect(result.error.details).toBeUndefined();
      }
    });

    it('returns network error when request has no response', async () => {
      const networkError = new AxiosError(
        'Network Error',
        'ERR_NETWORK',
        undefined,
        undefined,
        undefined,
      );

      mockCreateBooking.mockRejectedValueOnce(networkError);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('NETWORK');
        expect(result.error.message).toContain('Verbindung zum Server fehlgeschlagen');
      }
    });

    it('returns server error on 500', async () => {
      const serverError = new AxiosError(
        'Internal Server Error',
        'ERR_BAD_RESPONSE',
        undefined,
        undefined,
        {
          status: 500,
          data: { message: 'Interner Serverfehler' },
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      );

      mockCreateBooking.mockRejectedValueOnce(serverError);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SERVER');
        expect(result.error.message).toContain('Serverfehler');
      }
    });

    it('returns server error on 500 without message in body', async () => {
      const serverError = new AxiosError(
        'Internal Server Error',
        'ERR_BAD_RESPONSE',
        undefined,
        undefined,
        {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      );

      mockCreateBooking.mockRejectedValueOnce(serverError);

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('SERVER');
        expect(result.error.message).toBe(
          'Ein Serverfehler ist aufgetreten. Bitte versuche es spaeter erneut.',
        );
      }
    });

    it('returns unknown error for non-axios errors', async () => {
      mockCreateBooking.mockRejectedValueOnce(new Error('Something went wrong'));

      const result = await bookingService.createBooking(validDraft);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('UNKNOWN');
        expect(result.error.message).toBe('Ein unerwarteter Fehler ist aufgetreten.');
      }
    });
  });
});
