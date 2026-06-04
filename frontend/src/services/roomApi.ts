import api from './api';
import type { AvailabilityResponse, RoomPage, Room } from '@/types/room';

export const roomApi = {
  getRooms(page: number, size = 5, checkIn?: string, checkOut?: string): Promise<RoomPage> {
    return api
      .get('/rooms', { params: { page, size, checkIn, checkOut } })
      .then((r) => r.data);
  },

  getRoom(id: number): Promise<Room> {
    return api.get(`/rooms/${id}`).then((r) => r.data);
  },

  checkAvailability(id: number, checkIn: string, checkOut: string): Promise<AvailabilityResponse> {
    return api
      .get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } })
      .then((r) => r.data);
  },
};
