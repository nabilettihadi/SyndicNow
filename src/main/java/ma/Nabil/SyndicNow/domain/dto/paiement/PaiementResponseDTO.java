package ma.Nabil.SyndicNow.domain.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.enums.StatutPaiement;
import ma.Nabil.SyndicNow.domain.enums.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementResponseDTO {
    private Long id;
    private String reference;
    private BigDecimal montant;
    private LocalDate datePaiement;
    private LocalDate dateEcheance;
    private TypePaiement type;
    private StatutPaiement statut;
    private String description;
    private Long appartementId;
    private String appartementNumero;
    private String proprietaireNom;
    private String proprietairePrenom;
    private String immeubleNom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
