package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.user.UserResponse;
import ma.Nabil.SyndicNow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "API pour la gestion des utilisateurs")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Récupérer tous les utilisateurs", description = "Renvoie la liste de tous les utilisateurs")
    @ApiResponse(responseCode = "200", description = "Liste des utilisateurs récupérée avec succès")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.debug("REST request to get all users");
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un utilisateur par son ID", description = "Renvoie un utilisateur spécifique par son ID")
    @ApiResponse(responseCode = "200", description = "Utilisateur récupéré avec succès")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        log.debug("REST request to get user by id : {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/activities/recent")
    @Operation(summary = "Récupérer les activités récentes", description = "Renvoie la liste des activités récentes des utilisateurs")
    @ApiResponse(responseCode = "200", description = "Liste des activités récupérée avec succès")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities() {
        log.debug("REST request to get recent activities");
        // Pour l'instant, nous renvoyons une liste vide
        // À implémenter avec une véritable fonctionnalité d'historique d'activités
        List<Map<String, Object>> activities = Collections.emptyList();
        return ResponseEntity.ok(activities);
    }
} 