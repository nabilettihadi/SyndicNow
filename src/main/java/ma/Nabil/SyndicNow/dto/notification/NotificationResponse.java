package ma.Nabil.SyndicNow.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userPhone;
    private String subject;
    private String content;
    private String attachmentPath;
    private boolean emailSent;
    private boolean smsSent;
    private LocalDateTime sentAt;
    private String status;
} 