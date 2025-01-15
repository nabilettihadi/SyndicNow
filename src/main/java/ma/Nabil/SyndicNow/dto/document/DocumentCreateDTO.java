package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class DocumentCreateDTO {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @NotNull(message = "Le type de document est obligatoire")
    private TypeDocument type;
    
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;
    
    private Date dateExpiration;
    
    // Métadonnées du fichier
    @NotBlank(message = "Le nom du fichier est obligatoire")
    private String nomFichier;
    
    @NotBlank(message = "Le type de contenu est obligatoire")
    private String typeContenu;
    
    @NotBlank(message = "Le chemin du fichier est obligatoire")
    private String cheminFichier;
    
    // Relations
    private Long createurId;
    private Long immeubleId;
    private Long transactionId;
    
    // Informations supplémentaires
    private boolean confidentiel;
    private String motsCles;
    private String commentaires;
    private String version;
}
