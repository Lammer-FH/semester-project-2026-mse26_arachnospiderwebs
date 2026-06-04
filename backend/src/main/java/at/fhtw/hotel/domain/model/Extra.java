package at.fhtw.hotel.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Extra {
  Long id;
  String name;
  String icon;
}
