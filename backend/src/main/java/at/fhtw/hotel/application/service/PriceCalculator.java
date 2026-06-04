package at.fhtw.hotel.application.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class PriceCalculator {

  static final BigDecimal BREAKFAST_SURCHARGE = new BigDecimal("7.50");

  private PriceCalculator() {}

  public static int calculateNights(LocalDate checkIn, LocalDate checkOut) {
    if (checkIn.equals(checkOut)) return 1;
    return (int) ChronoUnit.DAYS.between(checkIn, checkOut);
  }

  public static BigDecimal calculateTotal(BigDecimal pricePerNight, int nights, boolean breakfast) {
    BigDecimal base = pricePerNight.multiply(BigDecimal.valueOf(nights));
    if (breakfast) {
      base = base.add(BREAKFAST_SURCHARGE.multiply(BigDecimal.valueOf(nights)));
    }
    return base;
  }
}
