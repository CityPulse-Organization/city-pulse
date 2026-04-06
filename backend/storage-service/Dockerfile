FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY backend/storage-service/target/*.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "app.jar"]
