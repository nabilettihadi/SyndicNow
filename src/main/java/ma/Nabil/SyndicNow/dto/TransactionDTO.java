package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private String description;
    private Double montant;
    private LocalDateTime dateTransaction;
    private String type;
    private Long appartementId;
    private String status;
}
