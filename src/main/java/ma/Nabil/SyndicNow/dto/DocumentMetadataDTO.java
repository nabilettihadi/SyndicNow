package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;

import java.util.Date;

@Data
public class DocumentMetadataDTO {
    private Long id;
    private String reference;
    private String titre;
    private TypeDocument type;
    private String nomFichier;
    private String typeContenu;
    private long tailleFichier;
    private Date dateCreation;
    private Date dateExpiration;
    private boolean confidentiel;
    private String version;
    
    // Statistiques basiques
    private boolean expiré;
    private int joursAvantExpiration;
    private String createurNom;
}
