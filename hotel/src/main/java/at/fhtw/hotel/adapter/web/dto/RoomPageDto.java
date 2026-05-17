package at.fhtw.hotel.adapter.web.dto;

import java.util.List;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RoomPageDto {
  List<RoomDto> content;
  long totalElements;
  int totalPages;
  int currentPage;
  boolean hasNextPage;
  boolean hasPreviousPage;
}
