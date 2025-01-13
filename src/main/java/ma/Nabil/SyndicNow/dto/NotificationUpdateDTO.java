package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeNotification;

import javax.validation.constraints.Size;
import java.util.Date;

@Data
public class NotificationUpdateDTO {
    private Long id;
    
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @Size(max = 1000, message = "Le message ne peut pas dépasser 1000 caractères")
    private String message;
    
    private TypeNotification type;
    private String lien;
    private Boolean urgente;
    private Date dateExpiration;
    private Boolean vue;
    private Date dateLecture;
    
    // Métadonnées d'envoi
    private Boolean envoyeeEmail;
    private Boolean envoyeeSMS;
    private String canal;
    private Integer tentativesEnvoi;
    private Date dernierEnvoi;
    private String statutEnvoi;
}
