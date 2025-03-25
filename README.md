# SyndicNow - Système de Gestion de Copropriété

SyndicNow est une application complète de gestion de copropriété qui facilite la communication et la gestion des immeubles entre syndics et propriétaires. Elle permet la signalisation d'incidents, le suivi des appartements et la gestion des immeubles.

## 🏢 Fonctionnalités Principales

### Pour les Syndics
- Gestion des immeubles et appartements
- Suivi et traitement des incidents signalés
- Tableau de bord avec statistiques et indicateurs
- Gestion du profil et paramètres

### Pour les Propriétaires
- Consultation de leurs appartements
- Signalement d'incidents
- Suivi du statut des incidents
- Gestion du profil personnel

### Pour les Administrateurs
- Gestion des utilisateurs (syndics, propriétaires)
- Supervision globale du système
- Configuration des paramètres généraux

## 🏗️ Architecture Technique

SyndicNow est une application full-stack composée de :

### Backend
- **Framework**: Spring Boot
- **Base de données**: MySQL
- **Authentification**: JWT
- **Documentation API**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular
- **UI/UX**: Design responsive et interfaces intuitives
- **Sécurité**: Interception des requêtes et gestion des tokens

## 🔍 Diagramme de Classes

```
+------------------------+        +------------------+
|        User            |        |    Immeuble      |
+------------------------+        +------------------+
| - id: Long             |        | - id: Long       |
| - nom: String          |        | - nom: String    |
| - prenom: String       |        | - adresse: String|
| - email: String        |        | - ville: String  |
| - password: String     |        | - codePostal: Str|
| - role: Role           |        | - nombreEtages:Int
| - telephone: String    |<-------| - syndic: Syndic |
| - adresse: String      |        | - appartements:[]|
| - createdAt: DateTime  |        +------------------+
+------------------------+                 |
         ^                                 |
         |                                 |
+--------+-----------+      +--------------v--------+
|      Syndic        |      |      Appartement      |
+--------------------+      +-----------------------+
| - siret: String    |      | - id: Long            |
| - societe: String  |      | - numero: String      |
| - dateDebutActivite|      | - etage: Integer      |
| - immeubles: []    |<-----| - superficie: Float   |
+--------------------+      | - nbPieces: Integer   |
                            | - loyer: Double       |
+--------------------+      | - statut: Statut      |
|   Proprietaire     |      | - immeuble: Immeuble  |
+--------------------+      | - proprietaire: Propr.|
| - preferences: Enum|----->+-----------------------+
| - typeProprietaire |                |
| - appartements: [] |                |
+--------------------+                |
                                      v
                            +--------------------+
                            |      Incident      |
                            +--------------------+
                            | - id: Long         |
                            | - title: String    |
                            | - description: Str |
                            | - status: Status   |
                            | - priority: Priority|
                            | - reportedDate: Date|
                            | - reportedBy: User |
                            | - category: Category|
                            | - assignedTo: Syndic|
                            | - resolutionDate:Dt|
                            | - appartement: App |
                            | - immeuble: Immeuble|
                            +--------------------+
```

## 📊 Structure du Projet

```
SyndicNow/
├── frontend/                 # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Services, modèles, guards  
│   │   │   ├── features/     # Modules par rôle utilisateur
│   │   │   │   ├── admin/
│   │   │   │   ├── proprietaire/
│   │   │   │   ├── syndic/
│   │   │   │   └── auth/
│   │   │   └── shared/       # Composants partagés
└── src/                      # Backend Spring Boot
    └── main/
        ├── java/ma/Nabil/SyndicNow/
        │   ├── config/       # Configuration Spring
        │   ├── controller/   # Contrôleurs REST
        │   ├── dto/          # Objets de transfert de données
        │   ├── entity/       # Entités JPA
        │   ├── enums/        # Énumérations
        │   ├── exception/    # Gestion des exceptions
        │   ├── mapper/       # Mappeurs DTO/Entité
        │   ├── repository/   # Interfaces JPA
        │   ├── security/     # Configuration sécurité
        │   └── service/      # Logique métier
        └── resources/        # Configuration
```

## 🚀 Installation et démarrage

### Prérequis
- JDK 17+
- Maven 3.6+
- Node.js 18+ et npm
- MySQL 8+

### Backend
```bash
# Configurer la base de données dans application.properties
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

L'application sera disponible à l'adresse : http://localhost:4200

## 👥 Rôles utilisateur
- **ADMIN**: Accès complet à toutes les fonctionnalités
- **SYNDIC**: Gestion des immeubles et incidents
- **PROPRIETAIRE**: Consultation et signalement d'incidents

## 📱 Captures d'écran
- Tableau de bord syndic
- Liste des incidents
- Interface de gestion des appartements
- Profil utilisateur

## 💻 Technologies utilisées
- Spring Boot, Spring Security, Spring Data JPA
- Angular, TypeScript, Angular Material
- JWT pour l'authentification
- MySQL pour la persistance des données

## 🔐 Sécurité
L'application utilise JWT pour l'authentification et la sécurisation des endpoints. Chaque requête au backend nécessite un token JWT valide (sauf les endpoints d'authentification).

## Table des matières

- [Prérequis](#prérequis)
- [Structure du projet](#structure-du-projet)
- [Configuration Docker](#configuration-docker)
- [Déploiement avec Docker](#déploiement-avec-docker)
- [Accéder à l'application](#accéder-à-lapplication)
- [Connexion à la base de données](#connexion-à-la-base-de-données)
- [Développement](#développement)
- [Tests](#tests)
- [Contribution](#contribution)

## Prérequis

Pour exécuter cette application, vous aurez besoin de :

- Docker et Docker Compose
- Git (pour cloner le dépôt)

## Structure du projet

Le projet est structuré comme suit :

```
SyndicNow/
├── frontend/                   # Application Angular
│   ├── Dockerfile              # Dockerfile pour le frontend
│   └── nginx.conf              # Configuration Nginx
├── src/                        # Code source Java Spring Boot
├── initdb/                     # Scripts d'initialisation pour PostgreSQL
│   └── init.sql                # Script SQL d'initialisation
├── .env                        # Variables d'environnement
├── .dockerignore               # Fichiers à ignorer pour Docker
├── docker-compose.yml          # Configuration Docker Compose
├── Dockerfile                  # Dockerfile pour le backend
└── README.md                   # Ce fichier
```

## Configuration Docker

Le projet utilise Docker pour faciliter le déploiement. La configuration comprend :

1. **Backend (Spring Boot)** : Conteneur Java qui exécute l'API REST
2. **Frontend (Angular)** : Conteneur Nginx qui sert l'application web
3. **Base de données (PostgreSQL)** : Conteneur pour stocker les données
4. **PgAdmin** : Interface web pour administrer la base de données

## Déploiement avec Docker

### Cloner le dépôt

```bash
git clone https://github.com/votre-nom/SyndicNow.git
cd SyndicNow
```

### Configuration des variables d'environnement

Vérifiez et modifiez le fichier `.env` selon vos besoins :

```
# Variables PostgreSQL
POSTGRES_USER=syndicnow
POSTGRES_PASSWORD=syndicnow123
POSTGRES_DB=syndicnow_db
POSTGRES_PORT=5432

# Configuration PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@syndicnow.ma
PGADMIN_DEFAULT_PASSWORD=syndicnow123
PGADMIN_PORT=5050

# Configuration backend
BACKEND_PORT=8080
JWT_SECRET=votre_secret_jwt
```

### Construire et démarrer les conteneurs

Pour démarrer tous les services :

```bash
docker-compose up -d
```

Pour reconstruire les images et démarrer les conteneurs :

```bash
docker-compose up -d --build
```

### Arrêter les conteneurs

```bash
docker-compose down
```

Pour supprimer également les volumes :

```bash
docker-compose down -v
```

## Accéder à l'application

Une fois les conteneurs démarrés, vous pouvez accéder aux différents services :

- **Application Web** : http://localhost:80
- **API Backend** : http://localhost:8080/api
- **PgAdmin** : http://localhost:5050
  - Email: admin@syndicnow.ma
  - Mot de passe: syndicnow123

## Connexion à la base de données

Pour se connecter à PostgreSQL via PgAdmin :

1. Accédez à http://localhost:5050
2. Connectez-vous avec les identifiants configurés dans `.env`
3. Ajoutez un nouveau serveur avec les paramètres suivants :
   - Nom : SyndicNow
   - Hôte : db
   - Port : 5432
   - Base de données : syndicnow_db
   - Utilisateur : syndicnow
   - Mot de passe : syndicnow123

## Développement

### Logs des conteneurs

Pour voir les logs d'un conteneur spécifique :

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Exécuter des commandes dans un conteneur

```bash
docker-compose exec backend /bin/sh
docker-compose exec db psql -U syndicnow -d syndicnow_db
```

## Tests

Les tests automatisés peuvent être exécutés avec :

```bash
docker-compose exec backend ./mvnw test
```

## Contribution

Pour contribuer à ce projet :

1. Créez une branche pour votre fonctionnalité
2. Effectuez vos modifications
3. Soumettez une pull request

---

© 2023 SyndicNow. Tous droits réservés.