package ma.Nabil.SyndicNow.dto.syndic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponseDTO;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyndicResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private Set<ImmeubleResponseDTO> immeubles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
