package at.fhtw.hotel.application.service;

import at.fhtw.hotel.application.exception.BookingAlreadyCancelledException;
import at.fhtw.hotel.application.exception.BookingNotFoundException;
import at.fhtw.hotel.application.exception.InvalidDateRangeException;
import at.fhtw.hotel.application.exception.RoomNotFoundException;
import at.fhtw.hotel.application.exception.RoomNotAvailableException;
import at.fhtw.hotel.domain.model.Booking;
import at.fhtw.hotel.domain.model.BookingStatus;
import at.fhtw.hotel.domain.repository.BookingRepository;
import at.fhtw.hotel.domain.repository.RoomRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

  private final BookingRepository bookingRepository;
  private final RoomRepository roomRepository;

  @Transactional
  public Booking createBooking(
      Long roomId,
      LocalDate checkIn,
      LocalDate checkOut,
      String firstName,
      String lastName,
      String email,
      boolean breakfast) {

    validateDateRange(checkIn, checkOut);

    var room = roomRepository.findById(roomId)
        .orElseThrow(() -> new RoomNotFoundException(roomId));

    if (bookingRepository.existsConfirmedOverlapping(roomId, checkIn, checkOut)) {
      throw new RoomNotAvailableException();
    }

    int nights = PriceCalculator.calculateNights(checkIn, checkOut);
    var totalPrice = PriceCalculator.calculateTotal(room.getPricePerNight(), nights, breakfast);

    var booking = Booking.builder()
        .id(UUID.randomUUID().toString())
        .room(room)
        .checkIn(checkIn)
        .checkOut(checkOut)
        .nights(nights)
        .firstName(firstName)
        .lastName(lastName)
        .email(email)
        .totalPrice(totalPrice)
        .breakfast(breakfast)
        .status(BookingStatus.CONFIRMED)
        .createdAt(Instant.now())
        .build();

    return bookingRepository.save(booking);
  }

  public Booking getBookingById(String id) {
    return bookingRepository.findById(id)
        .orElseThrow(() -> new BookingNotFoundException(id));
  }

  @Transactional
  public Booking cancelBooking(String id) {
    var booking = getBookingById(id);
    if (booking.getStatus() == BookingStatus.CANCELLED) {
      throw new BookingAlreadyCancelledException();
    }
    var cancelled = booking.toBuilder()
        .status(BookingStatus.CANCELLED)
        .build();
    return bookingRepository.save(cancelled);
  }

  private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
    if (checkIn.isBefore(LocalDate.now())) {
      throw new InvalidDateRangeException("checkIn must not be in the past");
    }
    if (checkOut.isBefore(checkIn)) {
      throw new InvalidDateRangeException("checkOut must be after checkIn");
    }
    int nights = PriceCalculator.calculateNights(checkIn, checkOut);
    if (nights > 30) {
      throw new InvalidDateRangeException("Maximum booking period is 30 nights");
    }
  }
}
