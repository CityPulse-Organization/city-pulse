FROM maven:3-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/api-gateway-v1.0.jar api-gateway-v1.0.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","api-gateway-v1.0.jar"]