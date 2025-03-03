package ma.Nabil.SyndicNow.service;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.auth.AuthenticationRequest;
import ma.Nabil.SyndicNow.dto.auth.AuthenticationResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.DuplicateResourceException;
import ma.Nabil.SyndicNow.repository.UserRepository;
import ma.Nabil.SyndicNow.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Un utilisateur existe déjà avec cet email");
        }

        if (request.getRole() == null) {
            request.setRole(Role.PROPRIETAIRE); // Default role
        }

        User user = switch (request.getRole()) {
            case SYNDIC -> Syndic.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .adresse(request.getAdresse())
                    .role(Role.SYNDIC)
                    .build();
            case PROPRIETAIRE -> Proprietaire.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .adresse(request.getAdresse())
                    .role(Role.PROPRIETAIRE)
                    .build();
            default -> throw new IllegalArgumentException("Role non supporté: " + request.getRole());
        };

        user = userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
