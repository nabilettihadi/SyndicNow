package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponseDTO;

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
    private Integer nombreEtages;
    private Integer nombreAppartements;
    private String description;
    private Long syndicId;
    private String syndicName;
    private String syndic;
    private Set<AppartementResponseDTO> appartements;
    private Integer nombreAppartementsOccupes;
    private Double tauxOccupation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 