package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.message.MessageRequest;
import ma.Nabil.SyndicNow.dto.message.MessageResponse;
import ma.Nabil.SyndicNow.entity.Message.MessageStatus;
import ma.Nabil.SyndicNow.entity.Message.MessagePriority;
import ma.Nabil.SyndicNow.entity.Message.MessageCategory;

import java.util.List;

public interface MessageService {
    MessageResponse createMessage(MessageRequest request);
    MessageResponse updateMessage(Long id, MessageRequest request);
    void deleteMessage(Long id);
    MessageResponse getMessageById(Long id);
    List<MessageResponse> getAllMessages();
    List<MessageResponse> getMessagesByStatus(MessageStatus status);
    List<MessageResponse> getMessagesByPriority(MessagePriority priority);
    List<MessageResponse> getMessagesByCategory(MessageCategory category);
    List<MessageResponse> getMessagesBySender(Long senderId);
    List<MessageResponse> getMessagesByImmeuble(Long immeubleId);
    List<MessageResponse> getMessagesByAppartement(Long appartementId);
    MessageResponse updateMessageStatus(Long id, MessageStatus status);
    MessageResponse markAsRead(Long id);
    MessageResponse archiveMessage(Long id);
    List<MessageResponse> getUnreadMessages(Long userId);
    List<MessageResponse> getArchivedMessages(Long userId);
} 