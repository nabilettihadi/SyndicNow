package ma.Nabil.SyndicNow.dto.document;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;
import ma.Nabil.SyndicNow.model.enums.StatutDocument;

import java.util.Date;

@Data
public class DocumentDTO {
    private Long id;
    private String reference;
    private String titre;
    private TypeDocument type;
    private StatutDocument statut;
    private String description;
    private Date dateCreation;
    private Date dateExpiration;
    
    // Métadonnées du fichier
    private String nomFichier;
    private String typeContenu;
    private long tailleFichier;
    private String cheminFichier;
    private String hash;
    
    // Relations simplifiées
    private Long createurId;
    private String createurNom;
    private Long immeubleId;
    private String immeubleNom;
    private Long transactionId;
    private String transactionReference;
    
    // Informations supplémentaires
    private boolean archivé;
    private boolean confidentiel;
    private String motsCles;
    private String commentaires;
    private String version;
    private Date dernièreModification;
    private String modifiéPar;
    
    // Statistiques
    private int nombreTelechargements;
    private Date dernierTelechargement;
    private boolean expiré;
    private int joursAvantExpiration;
}
