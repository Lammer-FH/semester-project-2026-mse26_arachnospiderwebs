buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath("org.flywaydb:flyway-mysql:11.14.1")
    classpath("com.mysql:mysql-connector-j:9.3.0")
  }
}

plugins {
  java
  id("org.springframework.boot") version "4.0.6"
  id("io.spring.dependency-management") version "1.1.7"
  id("org.flywaydb.flyway") version "11.14.1"
}

group = "at.fhtw"
version = "0.0.1-SNAPSHOT"

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(26)
  }
}

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-web")
  runtimeOnly("com.mysql:mysql-connector-j")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3")
  implementation("org.flywaydb:flyway-core")
  implementation("org.flywaydb:flyway-mysql")
  compileOnly("org.projectlombok:lombok")
  annotationProcessor("org.projectlombok:lombok")

  // Rest Assured 5.x is incompatible with Spring Boot 4 (Spring 7) + Java 25:
  // - spring-mock-mvc: MockHttpServletRequestBuilder.header(String,Object[]) API break
  // - full rest-assured: Groovy metaclass NPE on Java 25 for non-POST methods
  // Tests use Spring MockMvc directly instead (same coverage, native Spring 7 support).
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("com.h2database:h2")
  testCompileOnly("org.projectlombok:lombok")
  testAnnotationProcessor("org.projectlombok:lombok")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
  useJUnitPlatform()
}

flyway {
  url = System.getenv("DB_URL") ?: "jdbc:mysql://localhost:3306/hotel_booking?createDatabaseIfNotExist=true"
  user = System.getenv("DB_USERNAME") ?: "hotel"
  password = System.getenv("DB_PASSWORD") ?: "hotel"
  locations = arrayOf("filesystem:src/main/resources/db/migration")
  baselineOnMigrate = true
  baselineVersion = "0"
  cleanDisabled = false
  configurations = arrayOf("runtimeClasspath")
}
