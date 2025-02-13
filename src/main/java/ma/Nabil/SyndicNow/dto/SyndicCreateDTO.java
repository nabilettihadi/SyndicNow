package ma.Nabil.SyndicNow.dto;

import lombok.Data;

@Data
public class SyndicCreateDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String motDePasse;
}
