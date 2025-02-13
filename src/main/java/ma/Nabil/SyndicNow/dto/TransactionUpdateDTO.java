package ma.Nabil.SyndicNow.dto;

import lombok.Data;

@Data
public class TransactionUpdateDTO {
    private Long id;
    private String description;
    private Double montant;
    private String type;
    private String status;
}
