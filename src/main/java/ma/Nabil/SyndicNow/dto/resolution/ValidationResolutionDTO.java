package ma.Nabil.SyndicNow.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class ValidationResolutionDTO {
    @NotNull(message = "L'ID de la résolution est obligatoire")
    private Long resolutionId;
    
    private boolean valide;
    
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaires;
    
    // Notification
    private boolean notifierReclamant;
    private boolean notifierResponsable;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
