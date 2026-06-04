package at.fhtw.hotel.adapter.web.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RoomDto {
  Long id;
  String title;
  String description;
  String imageUrl;
  BigDecimal pricePerNight;
  List<ExtraDto> extras;
  RoomAvailabilitySummaryDto availability;
}
