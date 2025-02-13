package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class ImmeubleDTO {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String codePostal;
    private int nombreEtages;
    private int nombreAppartements;
    private double surfaceTotale;
    private Date dateConstruction;
    private Date dateAjout;
    
    // Informations d'assurance
    private String numeroPoliceAssurance;
    private String compagnieAssurance;
    private Date dateExpirationAssurance;
    private boolean assuranceValide;
    
    // Relations simplifiées
    private Long syndicId;
    private String syndicNom;
    private int nombreCopropriétaires;
    private double surfaceCommune;
    
    private List<String> equipements;
    private List<String> contactsUrgence;
    
    // Statistiques
    private int nombreIncidents;
    private double budgetAnnuel;
    private double totalCotisations;
    private double totalDepenses;
}
