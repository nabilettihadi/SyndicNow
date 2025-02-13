package ma.Nabil.SyndicNow.dto.intervention;

import lombok.Data;
import ma.Nabil.SyndicNow.dto.document.DocumentMetadataDTO;
import ma.Nabil.SyndicNow.model.enums.StatutIntervention;
import ma.Nabil.SyndicNow.model.enums.TypeIntervention;

import java.util.Date;
import java.util.List;

@Data
public class InterventionDTO {
    private Long id;
    private String reference;
    private String titre;
    private String description;
    private TypeIntervention type;
    private StatutIntervention statut;
    private Date datePlanifiee;
    private Date dateDebut;
    private Date dateFin;
    private Date dateCreation;
    private Date dateDerniereModification;
    
    // Relations simplifiées
    private Long equipementId;
    private String equipementNom;
    private String equipementReference;
    private Long immeubleId;
    private String immeubleNom;
    private Long resolutionId;
    private String resolutionReference;
    
    // Détails de l'intervention
    private String natureTravaux;
    private String observations;
    private String recommandations;
    private List<String> piecesChangees;
    private boolean interventionPreventive;
    private String mesuresPreventives;
    
    // Technicien
    private String technicien;
    private String contactTechnicien;
    private String entreprise;
    private String specialite;
    
    // Coûts et durée
    private double coutMateriel;
    private double coutMainOeuvre;
    private double coutTotal;
    private int dureeEstimee;     // en minutes
    private int dureeEffective;    // en minutes
    
    // Suivi
    private boolean urgente;
    private int progression;       // pourcentage
    private String problemeRencontre;
    private boolean necessite2emeIntervention;
    private String raisonNouvelle;
    private Date prochaineIntervention;
    
    // Documents
    private List<DocumentMetadataDTO> documents;
    
    // Validation
    private boolean validationRequise;
    private String validePar;
    private Date dateValidation;
    private String commentairesValidation;
    
    // Historique des actions
    private List<ActionInterventionDTO> historiqueActions;
    
    @Data
    public static class ActionInterventionDTO {
        private Date date;
        private String auteur;
        private String action;
        private String description;
        private StatutIntervention statutPrecedent;
        private StatutIntervention nouveauStatut;
        private String commentaire;
    }
}
