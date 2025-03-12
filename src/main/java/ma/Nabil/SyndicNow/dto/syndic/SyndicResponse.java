package ma.Nabil.SyndicNow.dto.syndic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyndicResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String societe;
    private String numeroLicence;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Long> immeubleIds;
} 