package at.fhtw.hotel.adapter.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookingResponseDto {
  String id;
  RoomDto room;
  LocalDate checkIn;
  LocalDate checkOut;
  int nights;
  String firstName;
  String lastName;
  String email;
  BigDecimal totalPrice;
  boolean breakfast;
  String status;
  Instant createdAt;
}
