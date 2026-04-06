FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY backend/mobile-bff-service/target/*.jar app.jar

EXPOSE 8086

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "app.jar"]
