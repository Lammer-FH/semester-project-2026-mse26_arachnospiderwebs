package at.fhtw.hotel.adapter.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AvailabilityResponseDto {
  Long roomId;
  String roomTitle;
  LocalDate checkIn;
  LocalDate checkOut;
  boolean available;
  int nights;
  BigDecimal totalPrice;
}
