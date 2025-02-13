package ma.Nabil.SyndicNow.dto.appartement;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeAppartement;

import java.util.Date;

@Data
public class AppartementDTO {
    private Long id;
    private String numero;
    private int etage;
    private double surface;
    private TypeAppartement type;
    private boolean occupe;
    private Date dateAjout;
    
    // Relations simplifiées
    private Long immeubleId;
    private String immeubleNom;
    private Long proprietaireId;
    private String proprietaireNom;
    
    // Statistiques
    private int nombreIncidents;
    private double totalCotisations;
    private double cotisationsImpayees;
    private double quotePart;
    private int nombreOccupants;
    
    // État
    private boolean aJour;
    private Date dernierPaiement;
    private double solde;
    
    // Compteurs
    private String numeroCompteurEau;
    private String numeroCompteurElectricite;
    private double dernierIndexEau;
    private double dernierIndexElectricite;
    private Date dateDernierReleve;
}
