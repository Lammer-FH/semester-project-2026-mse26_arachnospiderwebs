export interface Extra {
  id: number;
  name: string;
  icon: string;
}

export interface RoomAvailabilitySummary {
  available: boolean;
  checkIn: string | null;
  checkOut: string | null;
  nights: number | null;
  totalPrice: number | null;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  pricePerNight: number;
  extras: Extra[];
  availability: RoomAvailabilitySummary | null;
}

export interface RoomPage {
  content: Room[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AvailabilityResponse {
  roomId: number;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  available: boolean;
  nights: number;
  totalPrice: number;
}
