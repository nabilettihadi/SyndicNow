package ma.Nabil.SyndicNow.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class ValidationInterventionDTO {
    @NotNull(message = "L'ID de l'intervention est obligatoire")
    private Long interventionId;
    
    private boolean valide;
    
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaires;
    
    // Notification
    private boolean notifierTechnicien;
    private boolean notifierSyndic;
    private boolean notifierCopropriétaire;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
