package at.fhtw.hotel.adapter.web.dto;

import at.fhtw.hotel.application.service.AvailabilityResult;
import at.fhtw.hotel.domain.model.Booking;
import at.fhtw.hotel.domain.model.Extra;
import at.fhtw.hotel.domain.model.Room;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

  private static final HotelInfoDto HOTEL_INFO = HotelInfoDto.builder()
      .name("Boutique Hotel Technikum")
      .address("Höchstädtplatz 6, 1200 Wien")
      .phone("+43 1 XXXXXXX")
      .email("info@hotel-technikum.at")
      .directions("U6 Station Dresdner Straße, 2 Minuten Fußweg")
      .coordinates(HotelCoordinatesDto.builder()
          .lat(48.2392)
          .lng(16.378)
          .build())
      .build();

  public RoomDto toRoomDto(Room room) {
    return toRoomDto(room, null);
  }

  public RoomDto toRoomDto(Room room, RoomAvailabilitySummaryDto availability) {
    return RoomDto.builder()
        .id(room.getId())
        .title(room.getTitle())
        .description(room.getDescription())
        .imageUrl(room.getImageUrl())
        .pricePerNight(room.getPricePerNight())
        .extras(room.getExtras().stream().map(this::toExtraDto).toList())
        .availability(availability)
        .build();
  }

  public ExtraDto toExtraDto(Extra extra) {
    return ExtraDto.builder()
        .id(extra.getId())
        .name(extra.getName())
        .icon(extra.getIcon())
        .build();
  }

  public AvailabilityResponseDto toAvailabilityResponseDto(AvailabilityResult result) {
    return AvailabilityResponseDto.builder()
        .roomId(result.getRoom().getId())
        .roomTitle(result.getRoom().getTitle())
        .checkIn(result.getCheckIn())
        .checkOut(result.getCheckOut())
        .available(result.isAvailable())
        .nights(result.getNights())
        .totalPrice(result.getTotalPrice())
        .build();
  }

  public RoomAvailabilitySummaryDto toSummaryDto(AvailabilityResult result) {
    return RoomAvailabilitySummaryDto.builder()
        .available(result.isAvailable())
        .nights(result.getNights())
        .totalPrice(result.getTotalPrice())
        .build();
  }

  public BookingResponseDto toBookingResponseDto(Booking booking) {
    return BookingResponseDto.builder()
        .id(booking.getId())
        .room(toRoomDto(booking.getRoom()))
        .checkIn(booking.getCheckIn())
        .checkOut(booking.getCheckOut())
        .nights(booking.getNights())
        .firstName(booking.getFirstName())
        .lastName(booking.getLastName())
        .email(booking.getEmail())
        .totalPrice(booking.getTotalPrice())
        .breakfast(booking.isBreakfast())
        .status(booking.getStatus().name())
        .createdAt(booking.getCreatedAt())
        .build();
  }

  public BookingConfirmationDto toBookingConfirmationDto(Booking booking) {
    return BookingConfirmationDto.builder()
        .id(booking.getId())
        .room(toRoomDto(booking.getRoom()))
        .checkIn(booking.getCheckIn())
        .checkOut(booking.getCheckOut())
        .nights(booking.getNights())
        .firstName(booking.getFirstName())
        .lastName(booking.getLastName())
        .email(booking.getEmail())
        .totalPrice(booking.getTotalPrice())
        .breakfast(booking.isBreakfast())
        .status(booking.getStatus().name())
        .createdAt(booking.getCreatedAt())
        .hotel(HOTEL_INFO)
        .build();
  }
}
