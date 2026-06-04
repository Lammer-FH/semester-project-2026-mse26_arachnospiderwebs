package at.fhtw.hotel.adapter.web.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Boutique Hotel Technikum – Booking API",
        version = "2.0.0",
        description = "REST API für die Buchungs-App des Hotel Technikum. Gäste können Hotelzimmer durchsuchen, Verfügbarkeit prüfen und Zimmer buchen."
    ),
    servers = {
        @Server(url = "http://localhost:8080/api", description = "Local Development Server")
    }
)
public class OpenApiConfig {
}
