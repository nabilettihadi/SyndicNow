package ma.Nabil.SyndicNow.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class TransactionPaiementDTO {
    @NotNull(message = "L'ID de la transaction est obligatoire")
    private Long transactionId;
    
    @NotNull(message = "La date de paiement est obligatoire")
    private Date datePaiement;
    
    @NotBlank(message = "Le mode de paiement est obligatoire")
    private String modePaiement;
    
    private String referencePayment;
    private String numeroCheque;
    private String banque;
    
    private Double montantPaye;
    private String commentaires;
}
