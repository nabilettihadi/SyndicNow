package ma.Nabil.SyndicNow.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String cin;
    private String numeroAgrement;
    private LocalDateTime dateNaissance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 