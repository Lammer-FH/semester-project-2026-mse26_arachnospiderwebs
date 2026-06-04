package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.adapter.web.dto.AvailabilityResponseDto;
import at.fhtw.hotel.adapter.web.dto.BookingMapper;
import at.fhtw.hotel.adapter.web.dto.RoomAvailabilitySummaryDto;
import at.fhtw.hotel.adapter.web.dto.RoomDto;
import at.fhtw.hotel.adapter.web.dto.RoomPageDto;
import at.fhtw.hotel.application.service.AvailabilityResult;
import at.fhtw.hotel.application.service.RoomService;
import at.fhtw.hotel.domain.model.Room;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "Hotelzimmer durchsuchen und Details abrufen")
public class RoomController {

  private final RoomService roomService;
  private final BookingMapper mapper;

  @GetMapping
  @Operation(
      summary = "Paginierte Zimmerliste",
      description = "Gibt eine paginierte Liste aller Hotelzimmer zurück. Wenn checkIn und checkOut angegeben werden, enthält jedes Zimmer direkt seinen Verfügbarkeitsstatus."
  )
  @ApiResponse(responseCode = "200", description = "Erfolgreiche Anfrage")
  @ApiResponse(responseCode = "400", description = "Ungültige Parameter",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<RoomPageDto> getRooms(
      @Parameter(description = "Seitennummer (0-basiert)")
      @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Anzahl Zimmer pro Seite")
      @RequestParam(defaultValue = "5") int size,
      @Parameter(description = "Anreisedatum (Format: YYYY-MM-DD)")
      @RequestParam(required = false) LocalDate checkIn,
      @Parameter(description = "Abreisedatum (Format: YYYY-MM-DD)")
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
  @Operation(summary = "Zimmerdetails", description = "Gibt die Details eines einzelnen Zimmers zurück.")
  @ApiResponse(responseCode = "200", description = "Zimmer gefunden")
  @ApiResponse(responseCode = "404", description = "Zimmer nicht gefunden",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<RoomDto> getRoomById(
      @Parameter(description = "ID des Hotelzimmers") @PathVariable Long id) {
    Room room = roomService.getRoomById(id);
    return ResponseEntity.ok(mapper.toRoomDto(room));
  }

  @GetMapping("/{id}/availability")
  @Operation(summary = "Verfügbarkeit prüfen",
      description = "Prüft, ob ein bestimmtes Zimmer im gewünschten Zeitraum verfügbar ist.")
  @ApiResponse(responseCode = "200", description = "Verfügbarkeit erfolgreich geprüft")
  @ApiResponse(responseCode = "400", description = "Ungültiger Zeitraum",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "404", description = "Zimmer nicht gefunden",
      content = @Content(schema = @Schema(implementation = Map.class)))
  @ApiResponse(responseCode = "500", description = "Interner Serverfehler",
      content = @Content(schema = @Schema(implementation = Map.class)))
  public ResponseEntity<AvailabilityResponseDto> checkAvailability(
      @Parameter(description = "ID des Hotelzimmers") @PathVariable Long id,
      @Parameter(description = "Anreisedatum (Format: YYYY-MM-DD)") @RequestParam LocalDate checkIn,
      @Parameter(description = "Abreisedatum (Format: YYYY-MM-DD)") @RequestParam LocalDate checkOut) {
    AvailabilityResult result = roomService.checkAvailability(id, checkIn, checkOut);
    return ResponseEntity.ok(mapper.toAvailabilityResponseDto(result));
  }
}
