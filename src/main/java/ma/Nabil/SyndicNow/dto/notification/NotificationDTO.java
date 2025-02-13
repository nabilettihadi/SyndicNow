package ma.Nabil.SyndicNow.dto.notification;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeNotification;

import java.util.Date;

@Data
public class NotificationDTO {
    private Long id;
    private String titre;
    private String message;
    private TypeNotification type;
    private String lien;
    private boolean vue;
    private boolean urgente;
    private Date dateCreation;
    private Date dateExpiration;
    private Date dateLecture;
    
    // Relations simplifiées
    private Long destinataireId;
    private String destinataireNom;
    private String destinataireType;
    private Long immeubleId;
    private String immeubleNom;
    
    // Contexte
    private String sourceType;
    private Long sourceId;
    private String sourceReference;
    
    // Métadonnées
    private boolean expiree;
    private int joursAvantExpiration;
    private boolean envoyeeEmail;
    private boolean envoyeeSMS;
    private String canal;
    private int tentativesEnvoi;
    private Date dernierEnvoi;
    private String statutEnvoi;
}
