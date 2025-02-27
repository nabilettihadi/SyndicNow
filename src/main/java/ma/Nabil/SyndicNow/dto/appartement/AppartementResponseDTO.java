package ma.Nabil.SyndicNow.dto.appartement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementResponseDTO {
    private Long id;
    private String numero;
    private Integer etage;
    private Double superficie;
    private String description;
    private Long immeubleId;
    private String immeubleName;
    private Long proprietaireId;
    private String proprietaireName;
    private Boolean estOccupe;
    private String status;
    private String createdAt;
    private String updatedAt;
}
