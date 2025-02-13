package ma.Nabil.SyndicNow.dto.transaction;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;

import java.util.Date;

@Data
public class TransactionDTO {
    private Long id;
    private TypeTransaction type;
    private double montant;
    private String description;
    private String periode;
    private Date dateEcheance;
    private Long appartementId;
    private Long budgetId;
    private StatutTransaction statut;
    private Date datePaiement;
    private String modePaiement;
    private String referencePayment;
    private String numeroCheque;
    private String banque;
    private Long documentId;
    private String commentaires;
    private Double penalites;
}
