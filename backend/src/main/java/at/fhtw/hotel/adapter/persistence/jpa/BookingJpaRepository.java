package at.fhtw.hotel.adapter.persistence.jpa;

import at.fhtw.hotel.adapter.persistence.entity.BookingEntity;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingJpaRepository extends JpaRepository<BookingEntity, String> {

  @Query("""
      SELECT COUNT(b) > 0 FROM BookingEntity b
      WHERE b.room.id = :roomId
        AND b.status = 'CONFIRMED'
        AND b.checkIn <= :checkOut
        AND b.checkOut >= :checkIn
      """)
  boolean existsConfirmedOverlapping(
      @Param("roomId") Long roomId,
      @Param("checkIn") LocalDate checkIn,
      @Param("checkOut") LocalDate checkOut
  );
}
