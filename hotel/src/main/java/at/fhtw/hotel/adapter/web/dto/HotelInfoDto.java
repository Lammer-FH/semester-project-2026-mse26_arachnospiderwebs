package at.fhtw.hotel.adapter.web.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class HotelInfoDto {
  String name;
  String address;
  String phone;
  String email;
  String directions;
  HotelCoordinatesDto coordinates;
}
