package at.fhtw.hotel.domain.repository;

import at.fhtw.hotel.domain.model.Booking;
import java.time.LocalDate;
import java.util.Optional;

public interface BookingRepository {
  boolean existsConfirmedOverlapping(Long roomId, LocalDate checkIn, LocalDate checkOut);
  Booking save(Booking booking);
  Optional<Booking> findById(String id);
}
