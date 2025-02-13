package ma.Nabil.SyndicNow.dto.document;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutDocument;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;

import jakarta.validation.constraints.Size;
import java.util.Date;

@Data
public class DocumentUpdateDTO {
    private Long id;
    
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    private TypeDocument type;
    private StatutDocument statut;
    
    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    private String description;
    
    private Date dateExpiration;
    
    // Relations
    private Long immeubleId;
    private Long transactionId;
    
    // Informations supplémentaires
    private Boolean archivé;
    private Boolean confidentiel;
    private String motsCles;
    private String commentaires;
    private String version;
}
