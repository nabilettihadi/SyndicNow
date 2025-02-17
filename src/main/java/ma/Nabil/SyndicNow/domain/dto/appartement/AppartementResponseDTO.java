package ma.Nabil.SyndicNow.domain.dto.appartement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireResponseDTO;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementResponseDTO {
    private Long id;
    private String numero;
    private Integer etage;
    private Double surface;
    private Integer nombrePieces;
    private String type;
    private String description;
    private Long immeubleId;
    private String immeubleName;
    private ProprietaireResponseDTO proprietaire;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
