package ma.Nabil.SyndicNow.dto.appartement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementResponse {
    private Long id;
    private String numero;
    private Integer etage;
    private Double superficie;
    private Long immeubleId;
    private String immeubleName;
    private Long proprietaireId;
    private String proprietaireName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 