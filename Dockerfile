# Étape 1: Build avec Maven
FROM maven:3.8.5-openjdk-21-slim AS build
WORKDIR /app
COPY pom.xml .
# Télécharger toutes les dépendances
RUN mvn dependency:go-offline

COPY src/ /app/src/
RUN mvn clean package -DskipTests

# Étape 2: Runtime JRE uniquement
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Métadonnées pour la documentation
LABEL maintainer="Nabil <contact@syndicnow.ma>"
LABEL version="1.0"
LABEL description="Application SyndicNow pour la gestion de syndic d'immeubles"

# Créer un utilisateur non-root
RUN addgroup -S syndicnow && adduser -S syndicnow -G syndicnow
USER syndicnow

# Variables d'environnement pour configurer la JVM
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar /app/syndicnow.jar

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080

# Démarrer l'application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/syndicnow.jar"] 