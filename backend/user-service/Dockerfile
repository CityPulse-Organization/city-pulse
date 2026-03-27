FROM maven:3-eclipse-temurin-21 AS builder

ARG GITHUB_ACTOR
ARG GITHUB_TOKEN

WORKDIR /app

RUN echo '<settings><servers><server><id>github</id><username>'${GITHUB_ACTOR}'</username><password>'${GITHUB_TOKEN}'</password></server></servers></settings>' > /usr/share/maven/ref/settings-docker.xml

COPY pom.xml .

RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:go-offline

COPY src src
RUN mvn -s /usr/share/maven/ref/settings-docker.xml package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/user-service-v1.0.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java","-jar","app.jar"]
