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
    private Integer nombreEtages;
    private Integer nombreAppartements;
    private Long syndicId;
    private String syndicName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 