package ma.Nabil.SyndicNow.dto.message;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.entity.Message.MessageCategory;
import ma.Nabil.SyndicNow.entity.Message.MessagePriority;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotBlank(message = "Le sujet est obligatoire")
    private String subject;

    @NotBlank(message = "Le contenu est obligatoire")
    private String content;

    @NotNull(message = "La priorité est obligatoire")
    private MessagePriority priority;

    @NotNull(message = "La catégorie est obligatoire")
    private MessageCategory category;

    private Long parentMessageId;
    private Long appartementId;
    private Long immeubleId;
    private String attachmentUrls;
    private String recipients;
} 