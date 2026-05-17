package at.fhtw.hotel.application.exception;

public class InvalidDateRangeException extends RuntimeException {
  public InvalidDateRangeException(String message) {
    super(message);
  }
}
