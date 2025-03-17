package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.message.MessageRequest;
import ma.Nabil.SyndicNow.dto.message.MessageResponse;
import ma.Nabil.SyndicNow.entity.Message;
import ma.Nabil.SyndicNow.entity.Message.MessageStatus;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.MessageRepository;
import ma.Nabil.SyndicNow.repository.UserRepository;
import ma.Nabil.SyndicNow.service.MessageService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageResponse createMessage(MessageRequest request) {
        User sender = getCurrentUser();
        Message message = Message.builder().subject(request.getSubject()).content(request.getContent()).priority(request.getPriority()).category(request.getCategory()).sender(sender).parentMessage(request.getParentMessageId() != null ? messageRepository.findById(request.getParentMessageId()).orElse(null) : null).appartement(null) // Will be set based on appartementId if needed
                .immeuble(null)
                .attachmentUrls(request.getAttachmentUrls()).recipients(request.getRecipients()).build();

        return toMessageResponse(messageRepository.save(message));
    }

    @Override
    public MessageResponse updateMessage(Long id, MessageRequest request) {
        Message message = getMessage(id);
        validateMessageOwnership(message);

        message.setSubject(request.getSubject());
        message.setContent(request.getContent());
        message.setPriority(request.getPriority());
        message.setCategory(request.getCategory());
        message.setAttachmentUrls(request.getAttachmentUrls());
        message.setRecipients(request.getRecipients());

        return toMessageResponse(messageRepository.save(message));
    }

    @Override
    public void deleteMessage(Long id) {
        Message message = getMessage(id);
        validateMessageOwnership(message);
        messageRepository.delete(message);
    }

    @Override
    public MessageResponse getMessageById(Long id) {
        return toMessageResponse(getMessage(id));
    }

    @Override
    public List<MessageResponse> getAllMessages() {
        return messageRepository.findAll().stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByStatus(MessageStatus status) {
        return messageRepository.findByStatus(status).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByPriority(Message.MessagePriority priority) {
        return messageRepository.findByPriority(priority).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByCategory(Message.MessageCategory category) {
        return messageRepository.findByCategory(category).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesBySender(Long senderId) {
        return messageRepository.findBySenderId(senderId).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByImmeuble(Long immeubleId) {
        return messageRepository.findByImmeubleId(immeubleId).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessagesByAppartement(Long appartementId) {
        return messageRepository.findByAppartementId(appartementId).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public MessageResponse updateMessageStatus(Long id, MessageStatus status) {
        Message message = getMessage(id);
        message.setStatus(status);
        return toMessageResponse(messageRepository.save(message));
    }

    @Override
    public MessageResponse markAsRead(Long id) {
        Message message = getMessage(id);
        message.setRead(true);
        message.setStatus(MessageStatus.READ);
        return toMessageResponse(messageRepository.save(message));
    }

    @Override
    public MessageResponse archiveMessage(Long id) {
        Message message = getMessage(id);
        message.setArchived(true);
        message.setStatus(MessageStatus.ARCHIVED);
        return toMessageResponse(messageRepository.save(message));
    }

    @Override
    public List<MessageResponse> getUnreadMessages(Long userId) {
        return messageRepository.findByReadFalseAndRecipients(userId.toString()).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getArchivedMessages(Long userId) {
        return messageRepository.findByArchivedTrueAndRecipients(userId.toString()).stream().map(this::toMessageResponse).collect(Collectors.toList());
    }

    private Message getMessage(Long id) {
        return messageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
    }

    private void validateMessageOwnership(Message message) {
        User currentUser = getCurrentUser();
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new InvalidOperationException("You are not authorized to modify this message");
        }
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder().id(message.getId()).subject(message.getSubject()).content(message.getContent()).priority(message.getPriority()).category(message.getCategory()).status(message.getStatus()).senderId(message.getSender().getId()).senderName(message.getSender().getNom() + " " + message.getSender().getPrenom()).parentMessageId(message.getParentMessage() != null ? message.getParentMessage().getId() : null).appartementId(message.getAppartement() != null ? message.getAppartement().getId() : null).immeubleId(message.getImmeuble() != null ? message.getImmeuble().getId() : null).attachmentUrls(message.getAttachmentUrls()).recipients(message.getRecipients()).createdAt(message.getCreatedAt()).updatedAt(message.getUpdatedAt()).read(message.isRead()).archived(message.isArchived()).build();
    }
} 