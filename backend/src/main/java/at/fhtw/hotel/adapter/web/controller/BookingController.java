package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.adapter.web.dto.BookingCancelRequestDto;
import at.fhtw.hotel.adapter.web.dto.BookingConfirmationDto;
import at.fhtw.hotel.adapter.web.dto.BookingMapper;
import at.fhtw.hotel.adapter.web.dto.BookingRequestDto;
import at.fhtw.hotel.adapter.web.dto.BookingResponseDto;
import at.fhtw.hotel.application.exception.InvalidDateRangeException;
import at.fhtw.hotel.application.service.BookingService;
import at.fhtw.hotel.domain.model.Booking;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Buchungen erstellen, abrufen und stornieren")
public class BookingController {

  private final BookingService bookingService;
  private final BookingMapper mapper;

  @PostMapping
  @Operation(summary = "Buchung erstellen",
      description = "Erstellt eine neue Buchung für ein verfügbares Zimmer.")
  @ApiResponse(responseCode = "201", description = "Buchung erfolgreich erstellt")
  @ApiResponse(responseCode = "400", description = "Validierungsfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "404", description = "Raum nicht gefunden",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "409", description = "Zimmer nicht mehr verfügbar",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<BookingResponseDto> createBooking(
      @RequestBody @Valid BookingRequestDto request) {
    Booking booking = bookingService.createBooking(
        request.getRoomId(),
        request.getCheckIn(),
        request.getCheckOut(),
        request.getFirstName(),
        request.getLastName(),
        request.getEmail(),
        Boolean.TRUE.equals(request.getBreakfast()));
    return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toBookingResponseDto(booking));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buchungsbestätigung abrufen",
      description = "Gibt die vollständige Buchungsbestätigung zurück inkl. Hotelinformationen.")
  @ApiResponse(responseCode = "200", description = "Buchung gefunden")
  @ApiResponse(responseCode = "404", description = "Buchung nicht gefunden",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<BookingConfirmationDto> getBookingById(
      @Parameter(description = "UUID der Buchung") @PathVariable String id) {
    Booking booking = bookingService.getBookingById(id);
    return ResponseEntity.ok(mapper.toBookingConfirmationDto(booking));
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Buchung stornieren",
      description = "Storniert eine bestehende Buchung. Eine bereits stornierte Buchung kann nicht erneut storniert werden (409).")
  @ApiResponse(responseCode = "200", description = "Buchung erfolgreich storniert")
  @ApiResponse(responseCode = "404", description = "Buchung nicht gefunden",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "409", description = "Buchung ist bereits storniert",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<BookingConfirmationDto> cancelBooking(
      @Parameter(description = "UUID der Buchung") @PathVariable String id,
      @RequestBody @Valid BookingCancelRequestDto request) {
    if (!"CANCELLED".equals(request.getStatus())) {
      throw new InvalidDateRangeException("status must be CANCELLED");
    }
    Booking booking = bookingService.cancelBooking(id);
    return ResponseEntity.ok(mapper.toBookingConfirmationDto(booking));
  }
}
