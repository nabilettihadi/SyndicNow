package ma.Nabil.SyndicNow.exception;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private String code;
    private String message;
    private String path;
    private String details;
}
