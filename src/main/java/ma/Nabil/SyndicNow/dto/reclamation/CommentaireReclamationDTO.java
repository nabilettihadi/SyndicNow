package ma.Nabil.SyndicNow.dto.reclamation;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class CommentaireReclamationDTO {
    @NotNull(message = "L'ID de la réclamation est obligatoire")
    private Long reclamationId;
    
    @NotBlank(message = "Le texte du commentaire est obligatoire")
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String texte;
    
    private boolean interne;
    
    // Documents optionnels
    private List<Long> documentIds;
    
    // Notification
    private boolean notifierCopropriétaire;
    private boolean notifierAssigné;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
