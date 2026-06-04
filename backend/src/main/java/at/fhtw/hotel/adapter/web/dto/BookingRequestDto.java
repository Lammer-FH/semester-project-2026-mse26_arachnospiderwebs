package at.fhtw.hotel.adapter.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingRequestDto {

  @NotNull
  private Long roomId;

  @NotNull
  private LocalDate checkIn;

  @NotNull
  private LocalDate checkOut;

  @NotBlank
  @Size(max = 100)
  private String firstName;

  @NotBlank
  @Size(max = 100)
  private String lastName;

  @NotBlank
  @Email
  private String email;

  @NotNull
  private Boolean breakfast;
}
