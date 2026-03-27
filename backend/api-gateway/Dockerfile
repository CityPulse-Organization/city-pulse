FROM maven:3-eclipse-temurin-21 AS builder

ARG GITHUB_ACTOR
ARG GITHUB_TOKEN

WORKDIR /app

RUN echo '<settings><servers><server><id>github</id><username>'${GITHUB_ACTOR}'</username><password>'${GITHUB_TOKEN}'</password></server></servers></settings>' > /usr/share/maven/ref/settings-docker.xml

WORKDIR /app

COPY backend/pom.xml backend/
RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f backend/pom.xml -N clean install

COPY backend/city-pulse-common/pom.xml backend/city-pulse-common/
COPY backend/city-pulse-common/src backend/city-pulse-common/src/
RUN mvn -s /usr/share/maven/ref/settings-docker.xml -f backend/city-pulse-common/pom.xml clean install -DskipTests

COPY backend/api-gateway/pom.xml backend/api-gateway/
WORKDIR /app/backend/api-gateway

ARG REVISION
RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:go-offline -Drevision=${REVISION}

COPY backend/api-gateway/src src
RUN mvn -s /usr/share/maven/ref/settings-docker.xml package -DskipTests -Drevision=${REVISION}

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/backend/api-gateway/target/api-gateway-v1.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]