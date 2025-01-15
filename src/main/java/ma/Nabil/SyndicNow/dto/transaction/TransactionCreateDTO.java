package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class TransactionCreateDTO {
    @NotNull(message = "Le type de transaction est obligatoire")
    private TypeTransaction type;
    
    @Positive(message = "Le montant doit être positif")
    private double montant;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;
    
    private String periode;
    
    @NotNull(message = "La date d'échéance est obligatoire")
    private Date dateEcheance;
    
    @NotNull(message = "L'ID de l'appartement est obligatoire")
    private Long appartementId;
    
    // Informations de paiement optionnelles
    private String modePaiement;
    private String referencePayment;
    private String numeroCheque;
    private String banque;
    
    // Informations budgétaires
    @NotNull(message = "L'ID du budget est obligatoire")
    private Long budgetId;
    private String categorieBudget;
    
    // Document associé
    private Long documentId;
    
    private String commentaires;
}
