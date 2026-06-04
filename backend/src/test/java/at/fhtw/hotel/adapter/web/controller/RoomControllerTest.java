package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.BaseIntegrationTest;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RoomControllerTest extends BaseIntegrationTest {

  @Test
  void getRooms_withoutDates_returnsPageWithNullAvailability() throws Exception {
    mockMvc.perform(get("/api/rooms").param("page", "0").param("size", "5"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(5)))
        .andExpect(jsonPath("$.totalElements").value(5))
        .andExpect(jsonPath("$.totalPages").value(1))
        .andExpect(jsonPath("$.currentPage").value(0))
        .andExpect(jsonPath("$.hasNextPage").value(false))
        .andExpect(jsonPath("$.hasPreviousPage").value(false))
        .andExpect(jsonPath("$.content[0].availability").doesNotExist())
        .andExpect(jsonPath("$.content[0].extras", not(empty())));
  }

  @Test
  void getRooms_withDates_returnsAvailabilitySummary() throws Exception {
    mockMvc.perform(get("/api/rooms")
            .param("page", "0").param("size", "5")
            .param("checkIn", "2030-07-01").param("checkOut", "2030-07-05"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].availability.available").value(true))
        .andExpect(jsonPath("$.content[0].availability.nights").value(4))
        .andExpect(jsonPath("$.content[0].availability.totalPrice").isNumber());
  }

  @Test
  void getRooms_secondPage_returnsEmptyContent() throws Exception {
    mockMvc.perform(get("/api/rooms").param("page", "1").param("size", "5"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(0)))
        .andExpect(jsonPath("$.currentPage").value(1))
        .andExpect(jsonPath("$.hasPreviousPage").value(true));
  }

  @Test
  void getRooms_withInvalidDateRange_returns400() throws Exception {
    mockMvc.perform(get("/api/rooms")
            .param("checkIn", "2030-07-05").param("checkOut", "2030-07-01"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message", containsString("checkOut must be after checkIn")));
  }

  @Test
  void getRoomById_existingRoom_returnsRoomWithNullAvailability() throws Exception {
    mockMvc.perform(get("/api/rooms/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.title").value("Deluxe Suite"))
        .andExpect(jsonPath("$.imageUrl", startsWith("https://")))
        .andExpect(jsonPath("$.extras", hasSize(greaterThan(0))))
        .andExpect(jsonPath("$.availability").doesNotExist());
  }

  @Test
  void getRoomById_nonExistingRoom_returns404() throws Exception {
    mockMvc.perform(get("/api/rooms/9999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.error").value("Not Found"))
        .andExpect(jsonPath("$.message", containsString("Room not found")));
  }

  @Test
  void checkAvailability_availableRoom_returnsAvailableTrue() throws Exception {
    mockMvc.perform(get("/api/rooms/1/availability")
            .param("checkIn", "2030-08-01").param("checkOut", "2030-08-05"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roomId").value(1))
        .andExpect(jsonPath("$.roomTitle").value("Deluxe Suite"))
        .andExpect(jsonPath("$.available").value(true))
        .andExpect(jsonPath("$.nights").value(4))
        .andExpect(jsonPath("$.totalPrice").isNumber());
  }

  @Test
  void checkAvailability_sameDayCheckInOut_returnsOneNight() throws Exception {
    mockMvc.perform(get("/api/rooms/1/availability")
            .param("checkIn", "2030-08-01").param("checkOut", "2030-08-01"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.available").value(true))
        .andExpect(jsonPath("$.nights").value(1));
  }

  @Test
  void checkAvailability_checkOutBeforeCheckIn_returns400() throws Exception {
    mockMvc.perform(get("/api/rooms/1/availability")
            .param("checkIn", "2030-08-05").param("checkOut", "2030-08-01"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message", containsString("checkOut must be after checkIn")));
  }

  @Test
  void checkAvailability_moreThan30Nights_returns400() throws Exception {
    mockMvc.perform(get("/api/rooms/1/availability")
            .param("checkIn", "2030-08-01").param("checkOut", "2030-09-05"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message", containsString("30 nights")));
  }

  @Test
  void checkAvailability_nonExistingRoom_returns404() throws Exception {
    mockMvc.perform(get("/api/rooms/9999/availability")
            .param("checkIn", "2030-08-01").param("checkOut", "2030-08-05"))
        .andExpect(status().isNotFound());
  }

  @Test
  void checkAvailability_overlapsExistingBooking_returnsAvailableFalse() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2030-09-01",
                  "checkOut": "2030-09-05",
                  "firstName": "Test",
                  "lastName": "User",
                  "email": "test@example.com",
                  "breakfast": false
                }
                """))
        .andExpect(status().isCreated());

    mockMvc.perform(get("/api/rooms/1/availability")
            .param("checkIn", "2030-09-03").param("checkOut", "2030-09-07"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.available").value(false))
        .andExpect(jsonPath("$.totalPrice").doesNotExist());
  }
}
