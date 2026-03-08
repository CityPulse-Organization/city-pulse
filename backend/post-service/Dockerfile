FROM maven:3-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/post-service-v1.0.jar post-service-v1.0.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","post-service-v1.0.jar"]