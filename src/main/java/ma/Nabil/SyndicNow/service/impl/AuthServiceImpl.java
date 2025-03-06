package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.repository.UserRepository;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService, UserDetailsService {

    private final UserRepository userRepository;
    private final ProprietaireRepository proprietaireRepository;
    private final SyndicRepository syndicRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidOperationException("Email déjà utilisé");
        }

        User user;
        if (request.getRole() == Role.PROPRIETAIRE) {
            user = Proprietaire.builder().nom(request.getNom()).prenom(request.getPrenom()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).telephone(request.getTelephone()).adresse(request.getAdresse()).role(Role.PROPRIETAIRE).build();
            user = proprietaireRepository.save((Proprietaire) user);
        } else if (request.getRole() == Role.SYNDIC) {
            user = Syndic.builder().nom(request.getNom()).prenom(request.getPrenom()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).telephone(request.getTelephone()).adresse(request.getAdresse()).role(Role.SYNDIC).build();
            user = syndicRepository.save((Syndic) user);
        } else {
            throw new InvalidOperationException("Rôle invalide");
        }

        String token = jwtService.generateToken(user);
        return buildRegisterResponse(user, token);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new InvalidOperationException("Email ou mot de passe incorrect"));

        String token = jwtService.generateToken(user);
        return buildLoginResponse(user, token);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email));
    }

    private RegisterResponse buildRegisterResponse(User user, String token) {
        return RegisterResponse.builder().userId(user.getId()).email(user.getEmail()).nom(user.getNom()).prenom(user.getPrenom()).role(user.getRole().toString()).token(token).createdAt(LocalDateTime.now()).build();
    }

    private LoginResponse buildLoginResponse(User user, String token) {
        return LoginResponse.builder().userId(user.getId()).email(user.getEmail()).nom(user.getNom()).prenom(user.getPrenom()).role(user.getRole().toString()).token(token).isActive(user.isEnabled()).build();
    }
} 