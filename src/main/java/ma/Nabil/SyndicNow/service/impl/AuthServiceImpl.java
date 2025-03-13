package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.repository.UserRepository;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.security.CustomUserDetails;
import ma.Nabil.SyndicNow.security.JwtService;
import ma.Nabil.SyndicNow.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService, UserDetailsService {

    private final UserRepository userRepository;
    private final ProprietaireRepository proprietaireRepository;
    private final SyndicRepository syndicRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    // Utiliser un Set concurrent pour la thread-safety
    private final Set<String> invalidatedTokens = Collections.newSetFromMap(new ConcurrentHashMap<>());
    
    // Durée de conservation des tokens invalidés (24 heures)
    private static final long TOKEN_CLEANUP_DELAY = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    @PostConstruct
    public void init() {
        // Démarrer un thread de nettoyage des tokens invalidés
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::cleanupInvalidatedTokens, TOKEN_CLEANUP_DELAY, TOKEN_CLEANUP_DELAY, TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void destroy() {
        // Nettoyer les ressources à la fermeture de l'application
        invalidatedTokens.clear();
    }

    private void cleanupInvalidatedTokens() {
        invalidatedTokens.removeIf(token -> {
            try {
                // On crée un UserDetails temporaire pour vérifier la validité du token
                UserDetails tempUser = CustomUserDetails.builder()
                    .id(0L)
                    .email("temp@email.com")
                    .password("")
                    .nom("")
                    .prenom("")
                    .role(Role.PROPRIETAIRE.name())
                    .build();
                return !jwtService.isTokenValid(token, tempUser);
            } catch (Exception e) {
                return true; // En cas d'erreur, on considère le token comme expiré
            }
        });
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidOperationException("Email déjà utilisé");
        }

        // Vérifier que le rôle est valide pour l'inscription
        if (request.getRole() == Role.ADMIN) {
            throw new InvalidOperationException("Impossible de créer un compte administrateur via l'inscription");
        }

        User user;
        if (request.getRole() == Role.PROPRIETAIRE) {
            user = Proprietaire.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .adresse(request.getAdresse())
                    .cin(request.getCin())
                    .build();
            user = proprietaireRepository.save((Proprietaire) user);
        } else if (request.getRole() == Role.SYNDIC) {
            // Vérifier que les champs obligatoires du syndic sont présents
            if (request.getSiret() == null || request.getNumeroLicence() == null || 
                request.getSociete() == null || request.getDateDebutActivite() == null) {
                throw new InvalidOperationException("Les champs SIRET, numéro de licence, société et date de début d'activité sont obligatoires pour un syndic");
            }
            
            user = Syndic.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .adresse(request.getAdresse())
                    .cin(request.getCin())
                    .siret(request.getSiret())
                    .numeroLicence(request.getNumeroLicence())
                    .societe(request.getSociete())
                    .dateDebutActivite(request.getDateDebutActivite())
                    .build();
            user = syndicRepository.save((Syndic) user);
        } else {
            throw new InvalidOperationException("Rôle invalide");
        }

        String token = jwtService.generateToken(CustomUserDetails.fromUser(user));
        
        return RegisterResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole().toString())
                .token(token)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Authentifier l'utilisateur
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Récupérer l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOperationException("Email ou mot de passe incorrect"));

        String token = jwtService.generateToken(CustomUserDetails.fromUser(user));
        
        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole().toString())
                .token(token)
                .build();
    }

    @Override
    public void logout(String token) {
        if (token != null && !token.isEmpty()) {
            // Vérifier si le token est valide avant de l'invalider
            try {
                jwtService.extractUsername(token);
                invalidatedTokens.add(token);
            } catch (Exception e) {
                throw new InvalidOperationException("Token invalide");
            }
        } else {
            throw new InvalidOperationException("Token manquant");
        }
    }
    
    public boolean isTokenInvalidated(String token) {
        return token != null && invalidatedTokens.contains(token);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email));
        return CustomUserDetails.fromUser(user);
    }
} 