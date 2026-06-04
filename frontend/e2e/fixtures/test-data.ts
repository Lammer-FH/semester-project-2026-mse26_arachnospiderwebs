import type { Room, RoomPage, AvailabilityResponse } from '../../src/types/room';
import type { BookingResponse, CreateBookingRequest } from '../../src/types/booking';
import type { BookingDraft } from '../../src/stores/bookingStore';

export function buildRoom(overrides?: Partial<Room>): Room {
  return {
    id: 1,
    title: 'Deluxe Suite',
    description: 'Eine geräumige Suite mit Balkon und Meerblick.',
    imageUrl: '/images/rooms/1.jpg',
    pricePerNight: 199,
    extras: [
      { id: 1, name: 'WiFi', icon: 'wifi' },
      { id: 2, name: 'Frühstück', icon: 'cafe' },
    ],
    availability: null,
    ...overrides,
  };
}

export function buildRoomPage(overrides?: Partial<RoomPage>): RoomPage {
  return {
    content: [buildRoom(), buildRoom({ id: 2, title: 'Standard Zimmer' })],
    totalElements: 2,
    totalPages: 1,
    currentPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    ...overrides,
  };
}

export function buildAvailabilityResponse(
  overrides?: Partial<AvailabilityResponse>,
): AvailabilityResponse {
  return {
    roomId: 1,
    roomTitle: 'Deluxe Suite',
    checkIn: '2026-07-15',
    checkOut: '2026-07-18',
    available: true,
    nights: 3,
    totalPrice: 597,
    ...overrides,
  };
}

export function buildBookingResponse(
  overrides?: Partial<BookingResponse>,
): BookingResponse {
  return {
    id: 'BK-123456',
    room: {
      id: 1,
      title: 'Deluxe Suite',
      description: 'Eine geräumige Suite mit Balkon und Meerblick.',
      imageUrl: '/images/rooms/1.jpg',
      pricePerNight: 199,
      extras: [
        { id: 1, name: 'WiFi', icon: 'wifi' },
        { id: 2, name: 'Frühstück', icon: 'cafe' },
      ],
      availability: null,
    },
    checkIn: '2026-07-15',
    checkOut: '2026-07-18',
    nights: 3,
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    totalPrice: 597,
    breakfast: false,
    status: 'CONFIRMED',
    createdAt: '2026-06-04T10:30:00Z',
    hotel: {
      name: 'Hotel Seeblick',
      address: 'Seestraße 1, 1010 Wien',
      phone: '+43 1 234 5678',
      email: 'hotel@example.com',
      directions: 'Vom Hauptbahnhof mit der Linie U1 bis Stephansplatz.',
      coordinates: { lat: 48.2082, lng: 16.3738 },
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    ...overrides,
  };
}

export function buildBookingRequest(
  overrides?: Partial<CreateBookingRequest>,
): CreateBookingRequest {
  return {
    roomId: 1,
    checkIn: '2026-07-15',
    checkOut: '2026-07-18',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com',
    breakfast: false,
    ...overrides,
  };
}

export function buildBookingDraft(overrides?: Partial<BookingDraft>): BookingDraft {
  return {
    roomId: 1,
    roomTitle: 'Deluxe Suite',
    roomImage: '/images/rooms/1.jpg',
    roomDescription: 'Eine geräumige Suite mit Balkon und Meerblick.',
    pricePerNight: 199,
    checkIn: '2026-07-15',
    checkOut: '2026-07-18',
    nights: 3,
    totalPrice: 597,
    extras: [
      { id: 1, name: 'WiFi', icon: 'wifi' },
      { id: 2, name: 'Frühstück', icon: 'cafe' },
    ],
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    breakfast: false,
    ...overrides,
  };
}
