package ma.Nabil.SyndicNow.config;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource())).authorizeHttpRequests(auth -> auth
                // Endpoints publics
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll().requestMatchers("/api/auth/authenticate", "/api/auth/register").permitAll()

                // Endpoints Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Endpoints Syndic
                .requestMatchers("/api/syndic/**").hasRole("SYNDIC")

                // Endpoints Propriétaire
                .requestMatchers("/api/proprietaire/**").hasRole("PROPRIETAIRE").requestMatchers("/api/appartements/proprietaire/**").hasRole("PROPRIETAIRE")

                // Endpoints Appartements
                .requestMatchers(HttpMethod.POST, "/api/appartements/**").hasAnyRole("ADMIN", "SYNDIC").requestMatchers(HttpMethod.PUT, "/api/appartements/**").hasAnyRole("ADMIN", "SYNDIC").requestMatchers(HttpMethod.DELETE, "/api/appartements/**").hasAnyRole("ADMIN", "SYNDIC").requestMatchers(HttpMethod.GET, "/api/appartements/**").hasAnyRole("ADMIN", "SYNDIC", "PROPRIETAIRE")

                // Endpoints Immeubles
                .requestMatchers(HttpMethod.GET, "/api/immeubles/**").hasAnyRole("ADMIN", "SYNDIC", "PROPRIETAIRE").requestMatchers(HttpMethod.POST, "/api/immeubles/**").hasAnyRole("ADMIN", "SYNDIC").requestMatchers(HttpMethod.PUT, "/api/immeubles/**").hasAnyRole("ADMIN", "SYNDIC").requestMatchers(HttpMethod.DELETE, "/api/immeubles/**").hasAnyRole("ADMIN", "SYNDIC")

                // Autres endpoints nécessitent une authentification
                .anyRequest().authenticated()).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).authenticationProvider(authenticationProvider).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
