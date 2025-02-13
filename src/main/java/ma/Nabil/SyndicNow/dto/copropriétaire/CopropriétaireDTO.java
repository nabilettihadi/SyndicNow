package ma.Nabil.SyndicNow.dto.copropriétaire;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeProprietaire;

import java.util.Date;
import java.util.List;

@Data
public class CopropriétaireDTO {
    private Long id;
    private String nom;
    private String cin;
    private String email;
    private String telephone;
    private String adresse;
    private TypeProprietaire type;
    private Date dateAjout;
    
    // Informations professionnelles
    private String profession;
    private String employeur;
    private String telephoneProfessionnel;
    
    // Relations simplifiées
    private List<AppartementSimpleDTO> appartements;
    
    // Statistiques financières
    private double totalQuotePart;
    private double totalCotisations;
    private double cotisationsImpayees;
    private boolean aJour;
    private Date dernierPaiement;
    private double solde;
    
    // Statistiques générales
    private int nombreAppartements;
    private int nombreIncidents;
    private int nombreReclamations;
    private boolean actif;
    
    @Data
    public static class AppartementSimpleDTO {
        private Long id;
        private String numero;
        private String immeuble;
        private double quotePart;
        private boolean aJour;
    }
}
