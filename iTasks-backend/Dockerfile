# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Set Maven memory limits for Render's free tier (512MB RAM)
ENV MAVEN_OPTS="-Xmx400m -Xms128m"

# Copy pom and download dependencies first (layer caching)
COPY pom.xml .
RUN mvn dependency:resolve -q --no-transfer-progress

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# ---- Runtime Stage ----
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar (wildcard avoids hardcoding SNAPSHOT version)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "/app/app.jar"]