package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;
import ma.Nabil.SyndicNow.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "API d'authentification")
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur",
            description = "Crée un nouveau compte utilisateur")
    @ApiResponse(responseCode = "200", description = "Inscription réussie")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/authenticate")
    @Operation(summary = "Authentification d'un utilisateur",
            description = "Authentifie un utilisateur et retourne un token JWT")
    @ApiResponse(responseCode = "200", description = "Authentification réussie")
    @ApiResponse(responseCode = "401", description = "Identifiants invalides")
    public ResponseEntity<LoginResponse> authenticate(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
