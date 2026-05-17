package at.fhtw.hotel.adapter.persistence.jpa;

import at.fhtw.hotel.adapter.persistence.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomJpaRepository extends JpaRepository<RoomEntity, Long> {
}
