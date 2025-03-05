package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Message;
import ma.Nabil.SyndicNow.entity.Message.MessageCategory;
import ma.Nabil.SyndicNow.entity.Message.MessagePriority;
import ma.Nabil.SyndicNow.entity.Message.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByStatus(MessageStatus status);
    List<Message> findByPriority(MessagePriority priority);
    List<Message> findByCategory(MessageCategory category);
    List<Message> findBySenderId(Long senderId);
    List<Message> findByImmeubleId(Long immeubleId);
    List<Message> findByAppartementId(Long appartementId);
    List<Message> findByReadFalseAndRecipients(String userId);
    List<Message> findByArchivedTrueAndRecipients(String userId);
} 