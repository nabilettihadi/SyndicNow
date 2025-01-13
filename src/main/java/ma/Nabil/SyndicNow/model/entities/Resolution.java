package ma.Nabil.SyndicNow.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titre;
    
    @Column(length = 1000)
    private String description;
    
    private boolean adoptee;
    private double quorumRequis;
    private double majoriteRequise;
    
    @ManyToOne
    @JoinColumn(name = "assemblee_id")
    private AssembleeGenerale assemblee;
    
    @ElementCollection
    @CollectionTable(name = "votes_resolution")
    @MapKeyJoinColumn(name = "copropriétaire_id")
    @Column(name = "vote")
    private Map<Copropriétaire, Boolean> votes;
    
    @Column(length = 1000)
    private String commentaires;
    
    public int getNombreVotesPour() {
        return (int) votes.values().stream().filter(v -> v).count();
    }
    
    public int getNombreVotesContre() {
        return (int) votes.values().stream().filter(v -> !v).count();
    }
    
    public double getPourcentageApprobation() {
        if (votes.isEmpty()) return 0;
        return (double) getNombreVotesPour() / votes.size() * 100;
    }
    
    public boolean isQuorumAtteint() {
        return (double) votes.size() / assemblee.getPresents().size() >= quorumRequis;
    }
    
    public boolean isMajoriteAtteinte() {
        return getPourcentageApprobation() >= majoriteRequise;
    }
}
