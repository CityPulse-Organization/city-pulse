FROM maven:3-eclipse-temurin-21 AS builder

ARG GITHUB_ACTOR
ARG GITHUB_TOKEN

WORKDIR /app

RUN echo '<settings><servers><server><id>github</id><username>'${GITHUB_ACTOR}'</username><password>'${GITHUB_TOKEN}'</password></server></servers></settings>' > /usr/share/maven/ref/settings-docker.xml

COPY backend/pom.xml backend/
RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f backend/pom.xml -N clean install

COPY backend/city-pulse-common/pom.xml backend/city-pulse-common/
COPY backend/city-pulse-common/src backend/city-pulse-common/src/
RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f backend/city-pulse-common/pom.xml clean install -DskipTests

COPY backend/mobile-bff-service/pom.xml backend/mobile-bff-service/
WORKDIR /app/backend/mobile-bff-service

ARG REVISION
RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:go-offline -Drevision=${REVISION}

COPY backend/mobile-bff-service/src src
RUN mvn -s /usr/share/maven/ref/settings-docker.xml package -DskipTests -Drevision=${REVISION}

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/backend/mobile-bff-service/target/*.jar app.jar

EXPOSE 8086

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "app.jar"]
