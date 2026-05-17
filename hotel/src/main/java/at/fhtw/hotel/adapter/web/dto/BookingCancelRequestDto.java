package at.fhtw.hotel.adapter.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingCancelRequestDto {

  @NotBlank
  private String status;
}
