package ma.Nabil.SyndicNow.domain.dto.syndic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.dto.immeuble.ImmeubleResponseDTO;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyndicResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String cin;
    private String numeroLicence;
    private String societe;
    private String siret;
    private LocalDateTime dateDebutActivite;
    private boolean enabled;
    private Set<ImmeubleResponseDTO> immeubles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
