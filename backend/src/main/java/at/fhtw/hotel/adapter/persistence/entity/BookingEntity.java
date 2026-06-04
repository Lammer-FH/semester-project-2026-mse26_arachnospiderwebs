package at.fhtw.hotel.adapter.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
public class BookingEntity {

  @Id
  @Column(length = 36)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_id", nullable = false)
  private RoomEntity room;

  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(nullable = false, length = 255)
  private String email;

  @Column(nullable = false)
  private boolean breakfast;

  @Column(name = "check_in", nullable = false)
  private LocalDate checkIn;

  @Column(name = "check_out", nullable = false)
  private LocalDate checkOut;

  @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal totalPrice;

  @Column(nullable = false, length = 20)
  private String status;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
