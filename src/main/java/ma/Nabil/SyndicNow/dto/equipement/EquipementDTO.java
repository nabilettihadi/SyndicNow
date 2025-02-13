package ma.Nabil.SyndicNow.dto.equipement;

import lombok.Data;
import ma.Nabil.SyndicNow.dto.document.DocumentMetadataDTO;
import ma.Nabil.SyndicNow.model.enums.TypeEquipement;

import java.util.Date;
import java.util.List;

@Data
public class EquipementDTO {
    private Long id;
    private String reference;
    private String nom;
    private TypeEquipement type;
    private String marque;
    private String modele;
    private String numeroSerie;
    private Date dateMiseEnService;
    private Date dateAchat;
    private Date dateDerniereRevision;
    private Date prochaineMaintenance;
    
    // Relations simplifiées
    private Long immeubleId;
    private String immeubleNom;
    private String fournisseurNom;
    
    // Informations de garantie
    private String numeroGarantie;
    private Date dateFinGarantie;
    private boolean sousGarantie;
    private boolean contratMaintenance;
    private Date dateFinContratMaintenance;
    
    // État et maintenance
    private boolean enService;
    private String etatActuel;
    private int nombrePannes;
    private int nombreInterventions;
    private Date dernierIncident;
    private double coutTotalMaintenance;
    
    // Documents associés
    private List<DocumentMetadataDTO> documents;
    
    // Interventions récentes
    private List<InterventionSimpleDTO> dernieresInterventions;
    
    @Data
    public static class InterventionSimpleDTO {
        private Long id;
        private Date dateIntervention;
        private String type;
        private String description;
        private double cout;
        private String technicien;
    }
}
