package ma.Nabil.SyndicNow.dto.proprietaire;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.PreferenceCommunication;
import ma.Nabil.SyndicNow.enums.TypeProprietaire;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String cin;
    private LocalDateTime dateNaissance;
    private PreferenceCommunication preferencesCommunication;
    private TypeProprietaire typeProprietaire;
    private Long immeubleId;
    private String immeubleName;
    private Long appartementId;
    private String appartementNumero;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 