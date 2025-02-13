package ma.Nabil.SyndicNow.dto.notification;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeNotification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
public class NotificationBatchDTO {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne peut pas dépasser 200 caractères")
    private String titre;
    
    @NotBlank(message = "Le message est obligatoire")
    @Size(max = 1000, message = "Le message ne peut pas dépasser 1000 caractères")
    private String message;
    
    @NotNull(message = "Le type de notification est obligatoire")
    private TypeNotification type;
    
    private String lien;
    private boolean urgente;
    private Date dateExpiration;
    
    // Liste des destinataires
    @NotEmpty(message = "La liste des destinataires ne peut pas être vide")
    private List<Long> destinataireIds;
    private String destinataireType;  // "SYNDIC" ou "COPROPRIÉTAIRE"
    
    // Filtres pour sélection des destinataires
    private Map<String, Object> filtres;
    
    // Contexte
    private Long immeubleId;
    private String sourceType;
    private Long sourceId;
    private String sourceReference;
    
    // Préférences d'envoi
    private boolean envoyerEmail;
    private boolean envoyerSMS;
    private String canal;
    private boolean envoyerParLots;
    private int tailleLot;
    private int delaiEntreLots;  // en secondes
}
