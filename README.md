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

---

Développé par [Nabil] - 2025