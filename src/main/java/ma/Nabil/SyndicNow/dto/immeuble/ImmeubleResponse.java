package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImmeubleResponse {
    private Long id;
    private String nom;
    private String adresse;
    private String codePostal;
    private String ville;
    private Integer nombreEtages;
    private Integer nombreAppartements;
    private Integer anneeConstruction;
    private String description;
    private Long syndicId;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
} 