package at.fhtw.hotel.domain.model;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Room {
  Long id;
  String title;
  String description;
  String imageUrl;
  BigDecimal pricePerNight;
  List<Extra> extras;
}
