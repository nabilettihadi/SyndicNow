package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.StatutReclamation;

import java.util.Date;
import java.util.List;

@Data
public class ReclamationDTO {
    private Long id;
    private String reference;
    private String titre;
    private String description;
    private StatutReclamation statut;
    private String categorie;
    private boolean urgente;
    private Date dateCreation;
    private Date dateDerniereModification;
    private Date dateCloture;
    
    // Relations simplifiées
    private Long copropriétaireId;
    private String copropriétaireNom;
    private Long appartementId;
    private String appartementNumero;
    private Long immeubleId;
    private String immeubleNom;
    
    // Assignation
    private String assignéA;
    private Date dateAssignation;
    private String commentairesAssignation;
    
    // Suivi
    private int delaiTraitement;
    private boolean horsDelai;
    private int joursDepuisCreation;
    private String priorite;
    private List<String> tags;
    
    // Documents
    private List<DocumentMetadataDTO> documents;
    
    // Historique des statuts
    private List<StatutHistoriqueDTO> historiqueStatuts;
    
    // Commentaires
    private List<CommentaireDTO> commentaires;
    
    @Data
    public static class StatutHistoriqueDTO {
        private StatutReclamation statut;
        private Date date;
        private String modifiePar;
        private String commentaire;
    }
    
    @Data
    public static class CommentaireDTO {
        private Long id;
        private String texte;
        private Date date;
        private String auteur;
        private boolean interne;  // commentaire interne ou visible par le copropriétaire
    }
}
