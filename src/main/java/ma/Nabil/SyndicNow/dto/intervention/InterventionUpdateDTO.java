package ma.Nabil.SyndicNow.dto.intervention;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutIntervention;
import ma.Nabil.SyndicNow.model.enums.TypeIntervention;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Data
public class InterventionUpdateDTO {
    private Long id;
    
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    private TypeIntervention type;
    private StatutIntervention statut;
    private Date datePlanifiee;
    private Date dateDebut;
    private Date dateFin;
    
    // Détails de l'intervention
    private String natureTravaux;
    private String observations;
    private String recommandations;
    private List<String> piecesChangees;
    private Boolean interventionPreventive;
    private String mesuresPreventives;
    
    // Technicien
    private String technicien;
    private String contactTechnicien;
    private String entreprise;
    private String specialite;
    
    // Coûts et durée
    @Min(value = 0, message = "Le coût du matériel ne peut pas être négatif")
    private Double coutMateriel;
    
    @Min(value = 0, message = "Le coût de la main d'œuvre ne peut pas être négatif")
    private Double coutMainOeuvre;
    
    @Min(value = 0, message = "La durée effective ne peut pas être négative")
    private Integer dureeEffective;
    
    // Suivi
    private Boolean urgente;
    
    @Min(value = 0, message = "La progression doit être entre 0 et 100")
    @Max(value = 100, message = "La progression doit être entre 0 et 100")
    private Integer progression;
    
    private String problemeRencontre;
    private Boolean necessite2emeIntervention;
    private String raisonNouvelle;
    private Date prochaineIntervention;
    
    // Documents
    private List<Long> documentIds;
    
    // Validation
    private Boolean validationRequise;
    private String commentairesValidation;
    
    // Commentaire de mise à jour
    @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères")
    private String commentaireMiseAJour;
    
    // Notification
    private boolean notifierSyndic;
    private boolean notifierCopropriétaire;
    private String canalNotification;  // "EMAIL", "SMS", "TOUS"
}
