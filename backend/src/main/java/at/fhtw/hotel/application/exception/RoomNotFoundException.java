package at.fhtw.hotel.application.exception;

public class RoomNotFoundException extends RuntimeException {
  public RoomNotFoundException(Long id) {
    super("Room not found: " + id);
  }
}
