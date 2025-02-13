package ma.Nabil.SyndicNow.dto.resolution;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeResolution;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class ResolutionCreateDTO {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    @NotNull(message = "Le type de résolution est obligatoire")
    private TypeResolution type;
    
    // Relations
    @NotNull(message = "L'ID de la réclamation est obligatoire")
    private Long reclamationId;
    
    @NotNull(message = "L'ID du responsable est obligatoire")
    private Long responsableId;
    
    // Détails de la résolution
    private String solution;
    private String mesuresPrises;
    private boolean preventif;
    private String mesuresPreventives;
    
    // Ressources
    @Min(value = 0, message = "Le coût estimé ne peut pas être négatif")
    private Double coutEstime;
    
    @Min(value = 0, message = "Le temps estimé ne peut pas être négatif")
    private Integer tempsEstime;
    
    private List<String> ressourcesNecessaires;
    
    // Suivi
    @Min(value = 0, message = "La progression doit être entre 0 et 100")
    @Max(value = 100, message = "La progression doit être entre 0 et 100")
    private Integer progression;
    
    private List<String> tags;
    
    // Documents
    private List<Long> documentIds;
    
    // Validation
    private boolean validationRequise;
    
    // Notification
    private boolean notifierReclamant;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
