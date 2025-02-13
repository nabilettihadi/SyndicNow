package ma.Nabil.SyndicNow.dto.resolution;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutResolution;
import ma.Nabil.SyndicNow.model.enums.TypeResolution;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class ResolutionUpdateDTO {
    private Long id;
    
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    private TypeResolution type;
    private StatutResolution statut;
    
    // Détails de la résolution
    private String solution;
    private String mesuresPrises;
    private String resultats;
    private Boolean preventif;
    private String mesuresPreventives;
    
    // Ressources
    @Min(value = 0, message = "Le coût réel ne peut pas être négatif")
    private Double coutReel;
    
    @Min(value = 0, message = "Le temps réel ne peut pas être négatif")
    private Integer tempsReel;
    
    private List<String> ressourcesNecessaires;
    
    // Suivi
    @Min(value = 0, message = "La progression doit être entre 0 et 100")
    @Max(value = 100, message = "La progression doit être entre 0 et 100")
    private Integer progression;
    
    private String problemeRencontre;
    private List<String> tags;
    
    // Documents
    private List<Long> documentIds;
    
    // Validation
    private Boolean validationRequise;
    private String commentairesValidation;
    
    // Commentaire de mise à jour
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaireMiseAJour;
    
    // Notification
    private boolean notifierReclamant;
    private boolean notifierResponsable;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
