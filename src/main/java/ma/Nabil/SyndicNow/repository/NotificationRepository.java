package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Notification;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import ma.Nabil.SyndicNow.model.enums.TypeNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCopropriétaire(Copropriétaire copropriétaire);
    List<Notification> findBySyndic(Syndic syndic);
    List<Notification> findByType(TypeNotification type);
    List<Notification> findByVueFalseAndDateExpirationAfter(Date date);
    List<Notification> findByDateCreationBetween(Date debut, Date fin);
}
