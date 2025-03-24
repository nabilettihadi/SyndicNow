package ma.Nabil.SyndicNow.dto.paiement;

import lombok.Data;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import java.time.LocalDateTime;

@Data
public class PaiementDTO {
    private Long id;
    private Double montant;
    private String type;
    private String status;
    private String description;
    private LocalDateTime datePaiement;
    private Long appartementId;
    private Proprietaire proprietaire;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 