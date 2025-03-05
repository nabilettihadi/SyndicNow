package ma.Nabil.SyndicNow.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.message.MessageRequest;
import ma.Nabil.SyndicNow.dto.message.MessageResponse;
import ma.Nabil.SyndicNow.entity.Message.MessageCategory;
import ma.Nabil.SyndicNow.entity.Message.MessagePriority;
import ma.Nabil.SyndicNow.entity.Message.MessageStatus;
import ma.Nabil.SyndicNow.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> createMessage(@Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.createMessage(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> updateMessage(@PathVariable Long id, @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.updateMessage(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> getMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.getMessageById(id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesByStatus(@PathVariable MessageStatus status) {
        return ResponseEntity.ok(messageService.getMessagesByStatus(status));
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesByPriority(@PathVariable MessagePriority priority) {
        return ResponseEntity.ok(messageService.getMessagesByPriority(priority));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesByCategory(@PathVariable MessageCategory category) {
        return ResponseEntity.ok(messageService.getMessagesByCategory(category));
    }

    @GetMapping("/sender/{senderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesBySender(@PathVariable Long senderId) {
        return ResponseEntity.ok(messageService.getMessagesBySender(senderId));
    }

    @GetMapping("/immeuble/{immeubleId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesByImmeuble(@PathVariable Long immeubleId) {
        return ResponseEntity.ok(messageService.getMessagesByImmeuble(immeubleId));
    }

    @GetMapping("/appartement/{appartementId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getMessagesByAppartement(@PathVariable Long appartementId) {
        return ResponseEntity.ok(messageService.getMessagesByAppartement(appartementId));
    }

    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> updateMessageStatus(@PathVariable Long id, @PathVariable MessageStatus status) {
        return ResponseEntity.ok(messageService.updateMessageStatus(id, status));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.markAsRead(id));
    }

    @PutMapping("/{id}/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> archiveMessage(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.archiveMessage(id));
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages(@RequestParam Long userId) {
        return ResponseEntity.ok(messageService.getUnreadMessages(userId));
    }

    @GetMapping("/archived")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> getArchivedMessages(@RequestParam Long userId) {
        return ResponseEntity.ok(messageService.getArchivedMessages(userId));
    }
} 