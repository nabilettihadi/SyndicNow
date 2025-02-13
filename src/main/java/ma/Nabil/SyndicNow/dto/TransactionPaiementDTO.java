package ma.Nabil.SyndicNow.dto;

import lombok.Data;

@Data
public class TransactionPaiementDTO {
    private Long id;
    private Double montantPaye;
    private String methodePaiement;
    private String reference;
}
