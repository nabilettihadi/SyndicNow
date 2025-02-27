package ma.Nabil.SyndicNow.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementResponseDTO {
    private Long id;
    private Long appartementId;
    private String appartementNumero;
    private String immeubleNom;
    private String proprietaireNom;
    private String proprietairePrenom;
    private LocalDate datePaiement;
    private Double montant;
    private Integer mois;
    private Integer annee;
    private String description;
    private String methodePaiement;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 