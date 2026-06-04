export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface HotelInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  directions: string;
  coordinates: { lat: number; lng: number };
  parkingInfo?: string;
  checkInInstructions?: string;
  checkInTime?: string;
  checkOutTime?: string;
  publicTransport?: string;
  trainStation?: string;
  travelTips?: string;
  emergencyContact?: string;
}

export interface BookingResponse {
  id: string;
  room: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    pricePerNight: number;
    extras: { id: number; name: string; icon: string }[];
    availability: null;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  firstName: string;
  lastName: string;
  email: string;
  totalPrice: number;
  breakfast: boolean;
  status: BookingStatus;
  createdAt: string;
  hotel?: HotelInfo;
}

export interface CreateBookingRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  email: string;
  breakfast: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type BookingErrorType = 'VALIDATION' | 'NETWORK' | 'SERVER' | 'UNKNOWN';

export interface BookingError {
  type: BookingErrorType;
  message: string;
  details?: ValidationError[];
}

export type BookingResult =
  | { success: true; data: BookingResponse }
  | { success: false; error: BookingError };
