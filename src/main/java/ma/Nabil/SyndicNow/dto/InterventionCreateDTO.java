package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeIntervention;

import javax.validation.constraints.Future;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Data
public class InterventionCreateDTO {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    @NotNull(message = "Le type d'intervention est obligatoire")
    private TypeIntervention type;
    
    @NotNull(message = "La date planifiée est obligatoire")
    @Future(message = "La date planifiée doit être dans le futur")
    private Date datePlanifiee;
    
    // Relations
    @NotNull(message = "L'ID de l'équipement est obligatoire")
    private Long equipementId;
    
    private Long resolutionId;
    
    // Détails de l'intervention
    private String natureTravaux;
    private List<String> piecesChangees;
    private boolean interventionPreventive;
    private String mesuresPreventives;
    
    // Technicien
    @NotBlank(message = "Le nom du technicien est obligatoire")
    private String technicien;
    
    @NotBlank(message = "Le contact du technicien est obligatoire")
    private String contactTechnicien;
    
    private String entreprise;
    private String specialite;
    
    // Coûts et durée
    @Min(value = 0, message = "Le coût du matériel ne peut pas être négatif")
    private Double coutMateriel;
    
    @Min(value = 0, message = "Le coût de la main d'œuvre ne peut pas être négatif")
    private Double coutMainOeuvre;
    
    @Min(value = 0, message = "La durée estimée ne peut pas être négative")
    private Integer dureeEstimee;
    
    // Suivi
    private boolean urgente;
    
    // Documents
    private List<Long> documentIds;
    
    // Validation
    private boolean validationRequise;
    
    // Notification
    private boolean notifierSyndic;
    private boolean notifierCopropriétaire;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
