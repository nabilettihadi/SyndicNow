package ma.Nabil.SyndicNow.domain.dto.immeuble;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.syndic.SyndicResponseDTO;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImmeubleResponseDTO {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays;
    private Integer nombreEtages;
    private Integer nombreAppartements;
    private Double surface;
    private String description;
    private SyndicResponseDTO syndic;
    private Set<AppartementResponseDTO> appartements;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
