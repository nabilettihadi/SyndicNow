package ma.Nabil.SyndicNow.dto.transaction;

import lombok.Data;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Date;

@Data
public class TransactionUpdateDTO {
    private Long id;
    
    @Positive(message = "Le montant doit être positif")
    private Double montant;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;
    
    private String statut;
    private Date dateEcheance;
    private Date datePaiement;
    
    // Informations de paiement
    private String modePaiement;
    private String referencePayment;
    private String numeroCheque;
    private String banque;
    
    // Informations budgétaires
    private Long budgetId;
    private String categorieBudget;
    
    // Document associé
    private Long documentId;
    
    private String commentaires;
    private Double penalites;
}
