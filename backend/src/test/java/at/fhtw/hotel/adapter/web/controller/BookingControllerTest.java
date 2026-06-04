package at.fhtw.hotel.adapter.web.controller;

import at.fhtw.hotel.BaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class BookingControllerTest extends BaseIntegrationTest {

  private MvcResult createBooking(int roomId, String checkIn, String checkOut,
      boolean breakfast) throws Exception {
    return mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": %d,
                  "checkIn": "%s",
                  "checkOut": "%s",
                  "firstName": "Anna",
                  "lastName": "Test",
                  "email": "anna@test.com",
                  "breakfast": %b
                }
                """.formatted(roomId, checkIn, checkOut, breakfast)))
        .andReturn();
  }

  private String createBookingAndGetId(int roomId, String checkIn, String checkOut,
      boolean breakfast) throws Exception {
    MvcResult result = createBooking(roomId, checkIn, checkOut, breakfast);
    String body = result.getResponse().getContentAsString();
    int start = body.indexOf("\"id\":\"") + 6;
    int end = body.indexOf("\"", start);
    return body.substring(start, end);
  }

  @Test
  void createBooking_validRequest_returns201WithBookingResponse() throws Exception {
    // room 2: 89.00/night, 4 nights, breakfast: 89*4 + 7.50*4 = 356 + 30 = 386
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 2,
                  "checkIn": "2030-10-01",
                  "checkOut": "2030-10-05",
                  "firstName": "Anna",
                  "lastName": "Test",
                  "email": "anna@test.com",
                  "breakfast": true
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isString())
        .andExpect(jsonPath("$.status").value("CONFIRMED"))
        .andExpect(jsonPath("$.room.id").value(2))
        .andExpect(jsonPath("$.nights").value(4))
        .andExpect(jsonPath("$.breakfast").value(true))
        .andExpect(jsonPath("$.totalPrice").value(386.0))
        .andExpect(jsonPath("$.createdAt").isString())
        .andExpect(jsonPath("$.hotel").doesNotExist());
  }

  @Test
  void createBooking_withoutBreakfast_calculatesBasePrice() throws Exception {
    // room 1: 149.00/night, 4 nights = 596.00
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2030-10-01",
                  "checkOut": "2030-10-05",
                  "firstName": "A", "lastName": "B",
                  "email": "a@b.com", "breakfast": false
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.totalPrice").value(596.0))
        .andExpect(jsonPath("$.breakfast").value(false));
  }

  @Test
  void createBooking_sameDayCheckInOut_createsOneNightBooking() throws Exception {
    // room 3: 79.00/night, same-day = 1 night = 79.00
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 3,
                  "checkIn": "2030-10-10",
                  "checkOut": "2030-10-10",
                  "firstName": "A", "lastName": "B",
                  "email": "a@b.com", "breakfast": false
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.nights").value(1))
        .andExpect(jsonPath("$.totalPrice").value(79.0));
  }

  @Test
  void createBooking_roomNotAvailable_returns409() throws Exception {
    createBooking(2, "2030-11-01", "2030-11-05", false);

    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 2,
                  "checkIn": "2030-11-03",
                  "checkOut": "2030-11-07",
                  "firstName": "Bob", "lastName": "Overlap",
                  "email": "bob@test.com", "breakfast": false
                }
                """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.error").value("Conflict"))
        .andExpect(jsonPath("$.message", containsString("no longer available")));
  }

  @Test
  void createBooking_invalidEmail_returns400WithFieldError() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2030-10-01", "checkOut": "2030-10-05",
                  "firstName": "X", "lastName": "Y",
                  "email": "not-an-email", "breakfast": false
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"))
        .andExpect(jsonPath("$.fieldErrors", hasSize(greaterThan(0))))
        .andExpect(jsonPath("$.fieldErrors[?(@.field=='email')]").isArray());
  }

  @Test
  void createBooking_blankFirstName_returns400() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2030-10-01", "checkOut": "2030-10-05",
                  "firstName": "",
                  "lastName": "Test", "email": "test@test.com", "breakfast": false
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fieldErrors[?(@.field=='firstName')]").isArray());
  }

  @Test
  void createBooking_pastCheckIn_returns400() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2020-01-01", "checkOut": "2020-01-05",
                  "firstName": "A", "lastName": "B",
                  "email": "a@b.com", "breakfast": false
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message", containsString("past")));
  }

  @Test
  void createBooking_roomNotFound_returns404() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 9999,
                  "checkIn": "2030-10-01", "checkOut": "2030-10-05",
                  "firstName": "X", "lastName": "Y",
                  "email": "x@y.com", "breakfast": false
                }
                """))
        .andExpect(status().isNotFound());
  }

  @Test
  void createBooking_checkOutBeforeCheckIn_returns400() throws Exception {
    mockMvc.perform(post("/api/bookings")
            .contentType("application/json")
            .content("""
                {
                  "roomId": 1,
                  "checkIn": "2030-10-05", "checkOut": "2030-10-01",
                  "firstName": "A", "lastName": "B",
                  "email": "a@b.com", "breakfast": false
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message", containsString("checkOut must be after checkIn")));
  }

  @Test
  void getBookingById_existingBooking_returnsConfirmationWithHotelInfo() throws Exception {
    String id = createBookingAndGetId(2, "2030-12-01", "2030-12-05", false);

    mockMvc.perform(get("/api/bookings/" + id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(id))
        .andExpect(jsonPath("$.status").value("CONFIRMED"))
        .andExpect(jsonPath("$.hotel.name").value("Boutique Hotel Technikum"))
        .andExpect(jsonPath("$.hotel.address").isString())
        .andExpect(jsonPath("$.hotel.coordinates.lat").value(48.2392))
        .andExpect(jsonPath("$.hotel.coordinates.lng").value(16.378));
  }

  @Test
  void getBookingById_nonExistingId_returns404() throws Exception {
    mockMvc.perform(get("/api/bookings/00000000-0000-0000-0000-000000000000"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.message", containsString("Booking not found")));
  }

  @Test
  void cancelBooking_confirmedBooking_returnsCANCELLED() throws Exception {
    String id = createBookingAndGetId(2, "2030-12-10", "2030-12-15", false);

    mockMvc.perform(patch("/api/bookings/" + id)
            .contentType("application/json")
            .content("""
                {"status": "CANCELLED"}
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(id))
        .andExpect(jsonPath("$.status").value("CANCELLED"))
        .andExpect(jsonPath("$.hotel.name").isString());
  }

  @Test
  void cancelBooking_alreadyCancelled_returns409() throws Exception {
    String id = createBookingAndGetId(3, "2030-12-20", "2030-12-25", false);
    String cancelBody = """
        {"status": "CANCELLED"}
        """;

    mockMvc.perform(patch("/api/bookings/" + id)
        .contentType("application/json").content(cancelBody))
        .andExpect(status().isOk());

    mockMvc.perform(patch("/api/bookings/" + id)
        .contentType("application/json").content(cancelBody))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("Booking is already cancelled"));
  }

  @Test
  void cancelBooking_nonExistingId_returns404() throws Exception {
    mockMvc.perform(patch("/api/bookings/00000000-0000-0000-0000-000000000000")
            .contentType("application/json")
            .content("""
                {"status": "CANCELLED"}
                """))
        .andExpect(status().isNotFound());
  }

  @Test
  void cancelBooking_roomBecomesAvailableAfterCancel() throws Exception {
    String id = createBookingAndGetId(4, "2030-12-10", "2030-12-15", false);

    mockMvc.perform(get("/api/rooms/4/availability")
            .param("checkIn", "2030-12-10").param("checkOut", "2030-12-15"))
        .andExpect(jsonPath("$.available").value(false));

    mockMvc.perform(patch("/api/bookings/" + id)
        .contentType("application/json").content("""
            {"status": "CANCELLED"}
            """))
        .andExpect(status().isOk());

    mockMvc.perform(get("/api/rooms/4/availability")
            .param("checkIn", "2030-12-10").param("checkOut", "2030-12-15"))
        .andExpect(jsonPath("$.available").value(true));
  }
}
