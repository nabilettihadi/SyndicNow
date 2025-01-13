package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeNotification;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TypeNotification type;
    
    private String titre;
    private String message;
    private boolean vue;
    private String lien;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateExpiration;
    
    @ManyToOne
    @JoinColumn(name = "syndic_id")
    private Syndic syndic;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    public boolean isActive() {
        return dateExpiration == null || dateExpiration.after(new Date());
    }
}
