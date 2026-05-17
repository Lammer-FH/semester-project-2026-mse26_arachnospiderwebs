package at.fhtw.hotel.adapter.web.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ExtraDto {
  Long id;
  String name;
  String icon;
}
