package ma.Nabil.SyndicNow.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.entity.Message.MessageCategory;
import ma.Nabil.SyndicNow.entity.Message.MessagePriority;
import ma.Nabil.SyndicNow.entity.Message.MessageStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private String subject;
    private String content;
    private MessagePriority priority;
    private MessageCategory category;
    private MessageStatus status;
    private Long senderId;
    private String senderName;
    private Long parentMessageId;
    private Long appartementId;
    private Long immeubleId;
    private String attachmentUrls;
    private String recipients;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean read;
    private boolean archived;
} 