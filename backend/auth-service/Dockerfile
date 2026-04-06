FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY backend/auth-service/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "app.jar"]
