package ma.Nabil.SyndicNow.dto.syndic;

import ma.Nabil.SyndicNow.model.enums.StatutSyndic;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class SyndicDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String adresse;
    private String raisonSociale;
    private String registreCommerce;
    private String identifiantFiscal;
    private StatutSyndic statut;
    private Date dateCreation;
    private List<String> coordonneesBancaires;
    private List<String> contactsUrgence;
    private int nombreImmeubles;
}
