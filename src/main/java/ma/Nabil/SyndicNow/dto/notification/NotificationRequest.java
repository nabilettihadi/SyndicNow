package ma.Nabil.SyndicNow.dto.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    @NotNull(message = "L'ID du destinataire est obligatoire")
    private Long userId;

    @NotBlank(message = "Le sujet est obligatoire")
    private String subject;

    @NotBlank(message = "Le contenu est obligatoire")
    private String content;

    private String attachmentPath;

    private boolean sendEmail;

    private boolean sendSms;
} 