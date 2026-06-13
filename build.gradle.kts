// ============================================================
// Root build file – single entry point for the whole project
// ============================================================

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        // MySQL driver for the dbSetup task (creates database + app user via JDBC)
        classpath("com.mysql:mysql-connector-j:9.3.0")
    }
}

// --------------- Helper: convert a project-relative path to a File --------
val rootDir: File get() = layout.projectDirectory.asFile

// --------------- Setup tasks --------------------------------

tasks.register("dbSetup") {
    description = "One-time MySQL setup: creates database 'hotel_booking' + user 'hotel'. Needs MySQL root: -ProotPassword=... (or env MYSQL_ROOT_PASSWORD)"
    group = "setup"
    doLast {
        val rootUser = (findProperty("rootUser") as String?) ?: System.getenv("MYSQL_ROOT_USER") ?: "root"
        val rootPassword = (findProperty("rootPassword") as String?) ?: System.getenv("MYSQL_ROOT_PASSWORD") ?: ""
        val driver = Class.forName("com.mysql.cj.jdbc.Driver")
            .getDeclaredConstructor().newInstance() as java.sql.Driver
        val props = java.util.Properties().apply {
            setProperty("user", rootUser)
            setProperty("password", rootPassword)
        }
        driver.connect("jdbc:mysql://localhost:3306/", props).use { conn ->
            conn.createStatement().use { st ->
                st.executeUpdate("CREATE DATABASE IF NOT EXISTS hotel_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                st.executeUpdate("CREATE USER IF NOT EXISTS 'hotel'@'localhost' IDENTIFIED BY 'hotel'")
                st.executeUpdate("GRANT ALL PRIVILEGES ON hotel_booking.* TO 'hotel'@'localhost'")
                st.executeUpdate("FLUSH PRIVILEGES")
            }
        }
        logger.lifecycle("✔ Database 'hotel_booking' and user 'hotel' are ready. Flyway creates tables + seed data on next backend startup.")
    }
}

tasks.register("dbReset") {
    description = "Reset the MySQL database: drops all tables (Flyway re-migrates on next backend startup)"
    group = "setup"
    dependsOn(":backend:flywayClean")
    doLast {
        logger.lifecycle("Dropped all tables in the MySQL database. Flyway will re-create them on next backend startup.")
    }
}

tasks.register<Exec>("frontendInstall") {
    description = "Install frontend npm dependencies"
    group = "setup"
    workingDir = file("frontend")
    commandLine("cmd", "/c", "npm", "install")
}

tasks.register("setup") {
    description = "Full one-shot setup: DB + frontend deps + backend build. Needs MySQL root: -ProotPassword=... (or env MYSQL_ROOT_PASSWORD)"
    group = "setup"
    dependsOn("dbSetup")
    dependsOn("frontendInstall")
    dependsOn(":backend:build")
}

// --------------- Development tasks -------------------------

tasks.register("start") {
    description = "Start backend (8080) and frontend (5173) concurrently"
    group = "development"
    doLast {
        logger.lifecycle("Starting backend + frontend concurrently …")
        logger.lifecycle("  Backend  → http://localhost:8080")
        logger.lifecycle("  Frontend → http://localhost:5173")
        logger.lifecycle("Press Ctrl+C to stop both.")
    }
    finalizedBy("startBackendAndFrontend")
}

tasks.register<Exec>("startBackendAndFrontend") {
    group = "development"
    workingDir = rootDir
    commandLine("cmd", "/c", "npm", "run", "dev")
}

tasks.register<Exec>("startBackend") {
    description = "Start only the Spring Boot backend (blocks)"
    group = "development"
    workingDir = file("backend")
    commandLine("cmd", "/c", "gradlew.bat", "bootRun")
}

tasks.register<Exec>("startFrontend") {
    description = "Start only the Vite frontend dev server (blocks)"
    group = "development"
    workingDir = file("frontend")
    commandLine("cmd", "/c", "npm", "run", "dev")
}
