# Étape 1 : Construction (CORRIGÉE : Utilisation de Gradle 8-jdk17, qui est plus récent que 8.6)
FROM gradle:8-jdk17 AS build
WORKDIR /app

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Exécuter la tâche 'bootJar'
RUN gradle bootJar -x test

# ---

# Étape 2 : Image Finale (Aucun changement nécessaire)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier le JAR exécutable depuis l'étape de construction
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]