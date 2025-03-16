package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImmeubleStatistics {
    private Long totalImmeubles;
    private Long totalAppartements;
    private Double totalRevenu;
    private Long totalProprietaires;
} 