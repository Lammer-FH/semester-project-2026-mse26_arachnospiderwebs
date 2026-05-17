package at.fhtw.hotel.adapter.persistence.adapter;

import at.fhtw.hotel.adapter.persistence.entity.ExtraEntity;
import at.fhtw.hotel.adapter.persistence.entity.RoomEntity;
import at.fhtw.hotel.adapter.persistence.jpa.RoomJpaRepository;
import at.fhtw.hotel.domain.model.Extra;
import at.fhtw.hotel.domain.model.Room;
import at.fhtw.hotel.domain.repository.RoomRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoomPersistenceAdapter implements RoomRepository {

  private final RoomJpaRepository jpaRepository;

  @Override
  public List<Room> findAll(int page, int size) {
    return jpaRepository.findAll(PageRequest.of(page, size))
        .stream()
        .map(this::toDomain)
        .toList();
  }

  @Override
  public long countAll() {
    return jpaRepository.count();
  }

  @Override
  public Optional<Room> findById(Long id) {
    return jpaRepository.findById(id).map(this::toDomain);
  }

  Room toDomain(RoomEntity e) {
    return Room.builder()
        .id(e.getId())
        .title(e.getTitle())
        .description(e.getDescription())
        .imageUrl(e.getImageUrl())
        .pricePerNight(e.getPricePerNight())
        .extras(e.getExtras().stream().map(this::extraToDomain).toList())
        .build();
  }

  private Extra extraToDomain(ExtraEntity e) {
    return Extra.builder()
        .id(e.getId())
        .name(e.getName())
        .icon(e.getIcon())
        .build();
  }
}
