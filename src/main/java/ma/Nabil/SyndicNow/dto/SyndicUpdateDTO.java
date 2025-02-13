package ma.Nabil.SyndicNow.dto;

import lombok.Data;

@Data
public class SyndicUpdateDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
}
