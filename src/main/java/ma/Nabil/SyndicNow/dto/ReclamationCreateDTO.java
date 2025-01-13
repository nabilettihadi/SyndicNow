package ma.Nabil.SyndicNow.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class ReclamationCreateDTO {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;
    
    @NotBlank(message = "La catégorie est obligatoire")
    private String categorie;
    
    private boolean urgente;
    
    // Relations
    @NotNull(message = "L'ID du copropriétaire est obligatoire")
    private Long copropriétaireId;
    
    @NotNull(message = "L'ID de l'appartement est obligatoire")
    private Long appartementId;
    
    // Assignation optionnelle
    private String assignéA;
    private String commentairesAssignation;
    
    // Métadonnées
    private String priorite;
    private List<String> tags;
    
    // Documents
    private List<Long> documentIds;
    
    // Commentaire initial
    private String commentaireInitial;
    private boolean commentaireInterne;
}
