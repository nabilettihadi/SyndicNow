package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeEquipement;

import java.util.Date;
import java.util.List;

@Data
public class EquipementUpdateDTO {
    private Long id;
    private String nom;
    private TypeEquipement type;
    private String marque;
    private String modele;
    private String numeroSerie;
    
    private Long fournisseurId;
    
    // Informations de garantie
    private String numeroGarantie;
    private Date dateFinGarantie;
    private Boolean contratMaintenance;
    private Date dateFinContratMaintenance;
    
    // État
    private Boolean enService;
    private String etatActuel;
    private Date dateDerniereRevision;
    private Date prochaineMaintenance;
    
    // Documents
    private List<Long> documentIds;
    
    // Informations supplémentaires
    private String emplacement;
    private String instructions;
    private String remarques;
}
