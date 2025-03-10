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
import java.util.HashSet;
import java.util.Set;

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
    
    // Set pour stocker les tokens invalidés (déconnexion)
    private final Set<String> invalidatedTokens = new HashSet<>();

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
            user = Syndic.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .adresse(request.getAdresse())
                    .cin(request.getCin())
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
        invalidatedTokens.add(token);
    }
    
    public boolean isTokenInvalidated(String token) {
        return invalidatedTokens.contains(token);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email));
        return CustomUserDetails.fromUser(user);
    }
} 