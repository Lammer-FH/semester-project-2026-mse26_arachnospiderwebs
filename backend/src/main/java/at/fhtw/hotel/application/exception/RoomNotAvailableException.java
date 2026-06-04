package at.fhtw.hotel.application.exception;

public class RoomNotAvailableException extends RuntimeException {
  public RoomNotAvailableException() {
    super("Room is no longer available for the selected dates");
  }
}
