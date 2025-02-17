package ma.Nabil.SyndicNow.domain.dto.proprietaire;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String cin;
    private boolean enabled;
    private Set<AppartementResponseDTO> appartements;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
