package ma.Nabil.SyndicNow.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private String sujet;
    private String contenu;
    private String status;
    private LocalDateTime dateLecture;
    private Long expediteurId;
    private String expediteurNom;
    private Long destinataireId;
    private String destinataireNom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
