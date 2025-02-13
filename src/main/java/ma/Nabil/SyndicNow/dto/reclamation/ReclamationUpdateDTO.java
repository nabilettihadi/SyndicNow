package ma.Nabil.SyndicNow.dto.reclamation;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutReclamation;

import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class ReclamationUpdateDTO {
    private Long id;
    
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    private StatutReclamation statut;
    private String categorie;
    private Boolean urgente;
    
    // Assignation
    private String assignéA;
    private String commentairesAssignation;
    
    // Métadonnées
    private String priorite;
    private List<String> tags;
    
    // Documents
    private List<Long> documentIds;
    
    // Commentaire de mise à jour
    private String commentaireMiseAJour;
    private boolean commentaireInterne;
    
    // Clôture
    private boolean cloture;
    private String raisonCloture;
}
