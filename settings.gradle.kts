plugins {
    // Auto-downloads the JDK required by the toolchain (languageVersion=26) if not installed locally
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "hotel-booking"

include("backend")
