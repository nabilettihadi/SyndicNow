package ma.Nabil.SyndicNow.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageCreateDTO {
    private String sujet;
    private String contenu;
    private Long expediteurId;
    private Long destinataireId;
}
