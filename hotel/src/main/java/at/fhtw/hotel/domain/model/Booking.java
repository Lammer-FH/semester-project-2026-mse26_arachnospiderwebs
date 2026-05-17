package at.fhtw.hotel.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Booking {
  String id;
  Room room;
  LocalDate checkIn;
  LocalDate checkOut;
  int nights;
  String firstName;
  String lastName;
  String email;
  BigDecimal totalPrice;
  boolean breakfast;
  BookingStatus status;
  Instant createdAt;
}
