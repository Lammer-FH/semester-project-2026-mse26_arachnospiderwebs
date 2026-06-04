package at.fhtw.hotel.adapter.persistence.config;

import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

  public FlywayConfig(DataSource dataSource) {
    Flyway.configure()
        .dataSource(dataSource)
        .locations("classpath:db/migration")
        .baselineOnMigrate(true)
        .baselineVersion("0")
        .load()
        .migrate();
  }
}
