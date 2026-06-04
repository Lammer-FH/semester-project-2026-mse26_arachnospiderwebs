package at.fhtw.hotel.application.service;

import at.fhtw.hotel.application.exception.InvalidDateRangeException;
import at.fhtw.hotel.application.exception.RoomNotFoundException;
import at.fhtw.hotel.domain.model.Room;
import at.fhtw.hotel.domain.repository.BookingRepository;
import at.fhtw.hotel.domain.repository.RoomRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomService {

  private final RoomRepository roomRepository;
  private final BookingRepository bookingRepository;

  public List<Room> getRooms(int page, int size) {
    return roomRepository.findAll(page, size);
  }

  public long countRooms() {
    return roomRepository.countAll();
  }

  public Room getRoomById(Long id) {
    return roomRepository.findById(id)
        .orElseThrow(() -> new RoomNotFoundException(id));
  }

  public AvailabilityResult checkAvailability(Long roomId, LocalDate checkIn, LocalDate checkOut) {
    validateDateRange(checkIn, checkOut);
    Room room = getRoomById(roomId);
    int nights = PriceCalculator.calculateNights(checkIn, checkOut);
    boolean available = !bookingRepository.existsConfirmedOverlapping(roomId, checkIn, checkOut);
    var totalPrice = available
        ? PriceCalculator.calculateTotal(room.getPricePerNight(), nights, false)
        : null;
    return new AvailabilityResult(room, checkIn, checkOut, available, nights, totalPrice);
  }

  private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
    if (checkOut.isBefore(checkIn)) {
      throw new InvalidDateRangeException("checkOut must be after checkIn");
    }
    int nights = PriceCalculator.calculateNights(checkIn, checkOut);
    if (nights > 30) {
      throw new InvalidDateRangeException("Maximum booking period is 30 nights");
    }
  }
}
