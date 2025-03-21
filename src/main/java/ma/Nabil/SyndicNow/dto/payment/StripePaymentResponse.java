package ma.Nabil.SyndicNow.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentResponse {
    private String sessionId;
    private String checkoutUrl;
} 