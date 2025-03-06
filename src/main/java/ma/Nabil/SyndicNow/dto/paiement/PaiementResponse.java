package ma.Nabil.SyndicNow.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementResponse {
    private Long id;
    private BigDecimal montant;
    private LocalDate dateEcheance;
    private LocalDate datePaiement;
    private String type;
    private String status;
    private Long appartementId;
    private String appartementNumero;
    private Long proprietaireId;
    private String proprietaireName;
    private String description;
    private String reference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 