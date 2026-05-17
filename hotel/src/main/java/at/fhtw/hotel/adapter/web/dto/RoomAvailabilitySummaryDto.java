package at.fhtw.hotel.adapter.web.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RoomAvailabilitySummaryDto {
  boolean available;
  int nights;
  BigDecimal totalPrice;
}
