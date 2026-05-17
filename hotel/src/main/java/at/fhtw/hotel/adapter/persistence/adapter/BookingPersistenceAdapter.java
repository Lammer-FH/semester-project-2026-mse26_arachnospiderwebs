package at.fhtw.hotel.adapter.persistence.adapter;

import at.fhtw.hotel.adapter.persistence.entity.BookingEntity;
import at.fhtw.hotel.adapter.persistence.jpa.BookingJpaRepository;
import at.fhtw.hotel.adapter.persistence.jpa.RoomJpaRepository;
import at.fhtw.hotel.domain.model.Booking;
import at.fhtw.hotel.domain.model.BookingStatus;
import at.fhtw.hotel.domain.repository.BookingRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingPersistenceAdapter implements BookingRepository {

  private final BookingJpaRepository bookingJpaRepository;
  private final RoomJpaRepository roomJpaRepository;
  private final RoomPersistenceAdapter roomPersistenceAdapter;

  @Override
  public boolean existsConfirmedOverlapping(Long roomId, LocalDate checkIn, LocalDate checkOut) {
    return bookingJpaRepository.existsConfirmedOverlapping(roomId, checkIn, checkOut);
  }

  @Override
  public Booking save(Booking booking) {
    var roomRef = roomJpaRepository.getReferenceById(booking.getRoom().getId());

    var entity = new BookingEntity();
    entity.setId(booking.getId());
    entity.setRoom(roomRef);
    entity.setFirstName(booking.getFirstName());
    entity.setLastName(booking.getLastName());
    entity.setEmail(booking.getEmail());
    entity.setBreakfast(booking.isBreakfast());
    entity.setCheckIn(booking.getCheckIn());
    entity.setCheckOut(booking.getCheckOut());
    entity.setTotalPrice(booking.getTotalPrice());
    entity.setStatus(booking.getStatus().name());
    entity.setCreatedAt(booking.getCreatedAt());

    var saved = bookingJpaRepository.save(entity);
    return toDomain(saved);
  }

  @Override
  public Optional<Booking> findById(String id) {
    return bookingJpaRepository.findById(id).map(this::toDomain);
  }

  private Booking toDomain(BookingEntity e) {
    var room = roomPersistenceAdapter.findById(e.getRoom().getId()).orElseThrow();
    return Booking.builder()
        .id(e.getId())
        .room(room)
        .checkIn(e.getCheckIn())
        .checkOut(e.getCheckOut())
        .nights(computeNights(e.getCheckIn(), e.getCheckOut()))
        .firstName(e.getFirstName())
        .lastName(e.getLastName())
        .email(e.getEmail())
        .totalPrice(e.getTotalPrice())
        .breakfast(e.isBreakfast())
        .status(BookingStatus.valueOf(e.getStatus()))
        .createdAt(e.getCreatedAt())
        .build();
  }

  private int computeNights(LocalDate checkIn, LocalDate checkOut) {
    if (checkIn.equals(checkOut)) return 1;
    return (int) ChronoUnit.DAYS.between(checkIn, checkOut);
  }
}
