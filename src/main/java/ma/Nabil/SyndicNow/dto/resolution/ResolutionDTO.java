package ma.Nabil.SyndicNow.dto.resolution;

import lombok.Data;
import ma.Nabil.SyndicNow.dto.document.DocumentMetadataDTO;
import ma.Nabil.SyndicNow.model.enums.StatutResolution;
import ma.Nabil.SyndicNow.model.enums.TypeResolution;

import java.util.Date;
import java.util.List;

@Data
public class ResolutionDTO {
    private Long id;
    private String reference;
    private String titre;
    private String description;
    private TypeResolution type;
    private StatutResolution statut;
    private Date dateCreation;
    private Date dateDerniereModification;
    private Date dateCompletion;
    
    // Relations simplifiées
    private Long reclamationId;
    private String reclamationReference;
    private Long responsableId;
    private String responsableNom;
    private Long immeubleId;
    private String immeubleNom;
    
    // Détails de la résolution
    private String solution;
    private String mesuresPrises;
    private String resultats;
    private boolean preventif;
    private String mesuresPreventives;
    
    // Ressources
    private double coutEstime;
    private double coutReel;
    private int tempsEstime;  // en heures
    private int tempsReel;    // en heures
    private List<String> ressourcesNecessaires;
    
    // Suivi
    private int progression;  // pourcentage
    private String problemeRencontre;
    private List<String> tags;
    private List<DocumentMetadataDTO> documents;
    
    // Historique des mises à jour
    private List<MiseAJourDTO> historiqueMisesAJour;
    
    // Validation
    private boolean validationRequise;
    private String validePar;
    private Date dateValidation;
    private String commentairesValidation;
    
    @Data
    public static class MiseAJourDTO {
        private Date date;
        private String auteur;
        private String description;
        private int progressionPrecedente;
        private int nouvelleProgression;
        private StatutResolution nouveauStatut;
        private String commentaire;
    }
}
