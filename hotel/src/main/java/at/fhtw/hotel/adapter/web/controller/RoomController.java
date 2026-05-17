package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.adapter.web.dto.AvailabilityResponseDto;
import at.fhtw.hotel.adapter.web.dto.BookingMapper;
import at.fhtw.hotel.adapter.web.dto.RoomAvailabilitySummaryDto;
import at.fhtw.hotel.adapter.web.dto.RoomDto;
import at.fhtw.hotel.adapter.web.dto.RoomPageDto;
import at.fhtw.hotel.application.service.AvailabilityResult;
import at.fhtw.hotel.application.service.RoomService;
import at.fhtw.hotel.domain.model.Room;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

  private final RoomService roomService;
  private final BookingMapper mapper;

  @GetMapping
  public ResponseEntity<RoomPageDto> getRooms(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "5") int size,
      @RequestParam(required = false) LocalDate checkIn,
      @RequestParam(required = false) LocalDate checkOut) {

    List<Room> rooms = roomService.getRooms(page, size);
    long total = roomService.countRooms();
    int totalPages = (int) Math.ceil((double) total / size);

    List<RoomDto> content = rooms.stream().map(room -> {
      if (checkIn != null && checkOut != null) {
        AvailabilityResult result = roomService.checkAvailability(room.getId(), checkIn, checkOut);
        RoomAvailabilitySummaryDto summary = mapper.toSummaryDto(result);
        return mapper.toRoomDto(room, summary);
      }
      return mapper.toRoomDto(room);
    }).toList();

    return ResponseEntity.ok(RoomPageDto.builder()
        .content(content)
        .totalElements(total)
        .totalPages(totalPages)
        .currentPage(page)
        .hasNextPage((page + 1) < totalPages)
        .hasPreviousPage(page > 0)
        .build());
  }

  @GetMapping("/{id}")
  public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
    Room room = roomService.getRoomById(id);
    return ResponseEntity.ok(mapper.toRoomDto(room));
  }

  @GetMapping("/{id}/availability")
  public ResponseEntity<AvailabilityResponseDto> checkAvailability(
      @PathVariable Long id,
      @RequestParam LocalDate checkIn,
      @RequestParam LocalDate checkOut) {
    AvailabilityResult result = roomService.checkAvailability(id, checkIn, checkOut);
    return ResponseEntity.ok(mapper.toAvailabilityResponseDto(result));
  }
}
