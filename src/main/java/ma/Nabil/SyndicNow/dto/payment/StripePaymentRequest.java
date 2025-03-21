package ma.Nabil.SyndicNow.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentRequest {
    private Long paiementId;
    private Long amount;
    private String description;
    private String customerEmail;
} 