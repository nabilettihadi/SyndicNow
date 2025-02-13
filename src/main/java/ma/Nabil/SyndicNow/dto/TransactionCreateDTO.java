package ma.Nabil.SyndicNow.dto;

import lombok.Data;

@Data
public class TransactionCreateDTO {
    private String description;
    private Double montant;
    private String type;
    private Long appartementId;
}
