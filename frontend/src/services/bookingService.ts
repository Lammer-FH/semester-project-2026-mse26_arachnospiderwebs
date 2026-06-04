import { bookingApi } from './bookingApi';
import type { CreateBookingRequest, BookingResult, BookingError, ValidationError } from '@/types/booking';
import { AxiosError } from 'axios';

export interface BookingDraftInput {
  roomId: number;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  email: string;
  breakfast: boolean;
}

function toRequest(draft: BookingDraftInput): CreateBookingRequest {
  return {
    roomId: draft.roomId,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    email: draft.email.trim(),
    breakfast: draft.breakfast,
  };
}

function isAxiosError(err: unknown): err is AxiosError<{ message?: string; errors?: Record<string, string[]> }> {
  return err instanceof AxiosError;
}

function parseError(err: unknown): BookingError {
  if (isAxiosError(err)) {
    if (!err.response) {
      return {
        type: 'NETWORK',
        message: 'Verbindung zum Server fehlgeschlagen. Bitte überprüfe deine Internetverbindung.',
      };
    }

    const status = err.response.status;
    const body = err.response.data;

    if (status === 400 || status === 422) {
      const details: ValidationError[] = [];
      if (body?.errors) {
        for (const [field, messages] of Object.entries(body.errors)) {
          if (Array.isArray(messages)) {
            for (const msg of messages) {
              details.push({ field, message: msg });
            }
          }
        }
      }
      return {
        type: 'VALIDATION',
        message: body?.message ?? 'Einige Angaben sind ungueltig.',
        details: details.length > 0 ? details : undefined,
      };
    }

    return {
      type: 'SERVER',
      message: body?.message ?? 'Ein Serverfehler ist aufgetreten. Bitte versuche es spaeter erneut.',
    };
  }

  return {
    type: 'UNKNOWN',
    message: 'Ein unerwarteter Fehler ist aufgetreten.',
  };
}

export const bookingService = {
  async createBooking(draft: BookingDraftInput): Promise<BookingResult> {
    try {
      const request = toRequest(draft);
      const data = await bookingApi.createBooking(request);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: parseError(err) };
    }
  },
};
