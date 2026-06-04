// ============================================================
// Root build file – single entry point for the whole project
// ============================================================

// --------------- Helper: convert a project-relative path to a File --------
val rootDir: File get() = layout.projectDirectory.asFile

// --------------- Setup tasks --------------------------------

tasks.register("dbInit") {
    description = "Delete old SQLite database (Flyway auto-migrates on next app startup)"
    group = "setup"

    doFirst {
        listOf(
            rootDir.resolve("backend/backend.db"),
            rootDir.resolve("backend/backend.db-shm"),
            rootDir.resolve("backend/backend.db-wal"),
        ).forEach { it.delete() }
        logger.lifecycle("Deleted old database files. Flyway will re-create them on next app startup.")
    }
}

tasks.register<Exec>("frontendInstall") {
    description = "Install frontend npm dependencies"
    group = "setup"
    workingDir = file("frontend")
    commandLine("cmd", "/c", "npm", "install")
}

tasks.register("setup") {
    description = "Full one-shot setup: DB + frontend deps + backend build"
    group = "setup"
    dependsOn("dbInit")
    dependsOn("frontendInstall")
    dependsOn(":backend:build")
}

// --------------- Development tasks -------------------------

tasks.register("start") {
    description = "Start backend (8080) and frontend (5173) concurrently"
    group = "development"
    dependsOn("dbInit")
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
    dependsOn("dbInit")
    workingDir = file("backend")
    commandLine("cmd", "/c", "gradlew.bat", "bootRun")
}

tasks.register<Exec>("startFrontend") {
    description = "Start only the Vite frontend dev server (blocks)"
    group = "development"
    workingDir = file("frontend")
    commandLine("cmd", "/c", "npm", "run", "dev")
}
