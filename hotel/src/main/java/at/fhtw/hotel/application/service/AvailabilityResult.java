package at.fhtw.hotel.application.service;

import at.fhtw.hotel.domain.model.Room;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Value;

@Value
public class AvailabilityResult {
  Room room;
  LocalDate checkIn;
  LocalDate checkOut;
  boolean available;
  int nights;
  BigDecimal totalPrice;
}
