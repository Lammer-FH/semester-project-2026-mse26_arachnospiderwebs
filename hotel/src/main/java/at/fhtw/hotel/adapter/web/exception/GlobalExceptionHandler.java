package at.fhtw.hotel.adapter.web.exception;

import at.fhtw.hotel.application.exception.BookingAlreadyCancelledException;
import at.fhtw.hotel.application.exception.BookingNotFoundException;
import at.fhtw.hotel.application.exception.InvalidDateRangeException;
import at.fhtw.hotel.application.exception.RoomNotFoundException;
import at.fhtw.hotel.application.exception.RoomNotAvailableException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RoomNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleRoomNotFound(
      RoomNotFoundException ex, HttpServletRequest req) {
    return error(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
  }

  @ExceptionHandler(BookingNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleBookingNotFound(
      BookingNotFoundException ex, HttpServletRequest req) {
    return error(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
  }

  @ExceptionHandler(RoomNotAvailableException.class)
  public ResponseEntity<Map<String, Object>> handleRoomNotAvailable(
      RoomNotAvailableException ex, HttpServletRequest req) {
    return error(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI());
  }

  @ExceptionHandler(BookingAlreadyCancelledException.class)
  public ResponseEntity<Map<String, Object>> handleAlreadyCancelled(
      BookingAlreadyCancelledException ex, HttpServletRequest req) {
    return error(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI());
  }

  @ExceptionHandler(InvalidDateRangeException.class)
  public ResponseEntity<Map<String, Object>> handleInvalidDateRange(
      InvalidDateRangeException ex, HttpServletRequest req) {
    return error(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest req) {
    List<Map<String, String>> fieldErrors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(fe -> Map.of("field", fe.getField(), "message",
            fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid"))
        .toList();

    Map<String, Object> body = Map.of(
        "timestamp", Instant.now().toString(),
        "status", HttpStatus.BAD_REQUEST.value(),
        "error", "Bad Request",
        "message", "Validation failed",
        "path", req.getRequestURI(),
        "fieldErrors", fieldErrors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneral(
      Exception ex, HttpServletRequest req) {
    return error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred",
        req.getRequestURI());
  }

  private ResponseEntity<Map<String, Object>> error(
      HttpStatus status, String message, String path) {
    Map<String, Object> body = Map.of(
        "timestamp", Instant.now().toString(),
        "status", status.value(),
        "error", status.getReasonPhrase(),
        "message", message,
        "path", path);
    return ResponseEntity.status(status).body(body);
  }
}
