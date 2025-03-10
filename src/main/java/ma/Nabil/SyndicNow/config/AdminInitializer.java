package ma.Nabil.SyndicNow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.entity.Admin;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email:admin@syndicnow.ma}")
    private String adminEmail;

    @Value("${admin.password:Admin@123}")
    private String adminPassword;

    @Value("${admin.nom:Admin}")
    private String adminNom;

    @Value("${admin.prenom:SyndicNow}")
    private String adminPrenom;

    @Value("${admin.telephone:+212600000000}")
    private String adminTelephone;

    @Value("${admin.cin:ADMIN123}")
    private String adminCin;

    @Override
    public void run(String... args) {
        // Vérifier si un administrateur existe déjà
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            log.info("Aucun administrateur trouvé, création d'un compte administrateur par défaut");
            
            // Créer un utilisateur administrateur
            Admin admin = Admin.builder()
                    .nom(adminNom)
                    .prenom(adminPrenom)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .telephone(adminTelephone)
                    .cin(adminCin)
                    .build();
            
            userRepository.save(admin);
            log.info("Compte administrateur créé avec succès: {}", adminEmail);
        } else {
            log.info("Un administrateur existe déjà dans le système");
        }
    }
} 