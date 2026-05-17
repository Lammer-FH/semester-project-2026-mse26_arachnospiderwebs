plugins {
  java
  id("org.springframework.boot") version "4.0.6"
  id("io.spring.dependency-management") version "1.1.7"
}

group = "at.fhtw"
version = "0.0.1-SNAPSHOT"

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(25)
  }
}

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.xerial:sqlite-jdbc:3.47.1.0")
  implementation("org.hibernate.orm:hibernate-community-dialects")
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
