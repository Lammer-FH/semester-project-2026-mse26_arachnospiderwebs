package at.fhtw.hotel.application.exception;

public class BookingNotFoundException extends RuntimeException {
  public BookingNotFoundException(String id) {
    super("Booking not found: " + id);
  }
}
