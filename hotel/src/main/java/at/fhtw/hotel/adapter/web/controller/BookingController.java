package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.adapter.web.dto.BookingCancelRequestDto;
import at.fhtw.hotel.adapter.web.dto.BookingConfirmationDto;
import at.fhtw.hotel.adapter.web.dto.BookingMapper;
import at.fhtw.hotel.adapter.web.dto.BookingRequestDto;
import at.fhtw.hotel.adapter.web.dto.BookingResponseDto;
import at.fhtw.hotel.application.exception.InvalidDateRangeException;
import at.fhtw.hotel.application.service.BookingService;
import at.fhtw.hotel.domain.model.Booking;
import jakarta.validation.Valid;
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
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

  private final BookingService bookingService;
  private final BookingMapper mapper;

  @PostMapping
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
  public ResponseEntity<BookingConfirmationDto> getBookingById(@PathVariable String id) {
    Booking booking = bookingService.getBookingById(id);
    return ResponseEntity.ok(mapper.toBookingConfirmationDto(booking));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<BookingConfirmationDto> cancelBooking(
      @PathVariable String id,
      @RequestBody @Valid BookingCancelRequestDto request) {
    if (!"CANCELLED".equals(request.getStatus())) {
      throw new InvalidDateRangeException("status must be CANCELLED");
    }
    Booking booking = bookingService.cancelBooking(id);
    return ResponseEntity.ok(mapper.toBookingConfirmationDto(booking));
  }
}
