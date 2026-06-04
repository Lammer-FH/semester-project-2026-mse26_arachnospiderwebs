import api from './api';
import type { BookingResponse, CreateBookingRequest } from '@/types/booking';

export const bookingApi = {
  createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    return api.post('/bookings', data).then((r) => r.data);
  },

  getBooking(id: string): Promise<BookingResponse> {
    return api.get(`/bookings/${id}`).then((r) => r.data);
  },
};
