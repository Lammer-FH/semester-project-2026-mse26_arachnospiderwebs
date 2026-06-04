package at.fhtw.hotel.domain.repository;

import at.fhtw.hotel.domain.model.Room;
import java.util.List;
import java.util.Optional;

public interface RoomRepository {
  List<Room> findAll(int page, int size);
  long countAll();
  Optional<Room> findById(Long id);
}
