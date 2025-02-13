package ma.Nabil.SyndicNow.model.entities;
import ma.Nabil.SyndicNow.model.enums.StatutIntervention;
import java.util.Date;
import ma.Nabil.SyndicNow.model.enums.StatutIntervention;


public class ActionIntervention {
    private Date date;
    private String action;
    private String auteur;
    private String description;


    private StatutIntervention statutPrecedent;
    private StatutIntervention nouveauStatut;


    private String commentaire;

    // Getters and Setters
    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getAuteur() {
        return auteur;
    }

    public void setAuteur(String auteur) {
        this.auteur = auteur;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StatutIntervention getStatutPrecedent() {
        return statutPrecedent;
    }

    public void setStatutPrecedent(StatutIntervention statutPrecedent) {
        this.statutPrecedent = statutPrecedent;
    }

    public StatutIntervention getNouveauStatut() {
        return nouveauStatut;
    }

    public void setNouveauStatut(StatutIntervention nouveauStatut) {
        this.nouveauStatut = nouveauStatut;
    }


    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}
