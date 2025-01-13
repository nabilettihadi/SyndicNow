package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;

import java.util.Date;

@Data
public class TransactionDTO {
    private Long id;
    private String reference;
    private TypeTransaction type;
    private StatutTransaction statut;
    private double montant;
    private String description;
    private String periode;
    private Date dateTransaction;
    private Date dateEcheance;
    private Date datePaiement;
    
    // Relations simplifiées
    private Long appartementId;
    private String appartementNumero;
    private String immeubleName;
    private String proprietaireName;
    
    // Informations de paiement
    private String modePaiement;
    private String referencePayment;
    private String numeroCheque;
    private String banque;
    
    // Informations budgétaires
    private Long budgetId;
    private String categorieBudget;
    private int annee;
    
    // Documents associés
    private Long documentId;
    private String documentReference;
    
    // Métadonnées
    private boolean enRetard;
    private int joursRetard;
    private double penalites;
    private String commentaires;
}
