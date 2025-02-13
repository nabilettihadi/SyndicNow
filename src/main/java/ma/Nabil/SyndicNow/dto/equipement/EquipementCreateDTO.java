package ma.Nabil.SyndicNow.dto.equipement;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeEquipement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.util.Date;
import java.util.List;

@Data
public class EquipementCreateDTO {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotNull(message = "Le type d'équipement est obligatoire")
    private TypeEquipement type;
    
    @NotBlank(message = "La marque est obligatoire")
    private String marque;
    
    private String modele;
    
    @NotBlank(message = "Le numéro de série est obligatoire")
    private String numeroSerie;
    
    @PastOrPresent(message = "La date de mise en service ne peut pas être dans le futur")
    private Date dateMiseEnService;
    
    @NotNull(message = "La date d'achat est obligatoire")
    @PastOrPresent(message = "La date d'achat ne peut pas être dans le futur")
    private Date dateAchat;
    
    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;
    
    private Long fournisseurId;
    
    // Informations de garantie
    private String numeroGarantie;
    private Date dateFinGarantie;
    private boolean contratMaintenance;
    private Date dateFinContratMaintenance;
    
    // Documents associés
    private List<Long> documentIds;
    
    // Informations supplémentaires
    private String emplacement;
    private String instructions;
    private String remarques;
}
