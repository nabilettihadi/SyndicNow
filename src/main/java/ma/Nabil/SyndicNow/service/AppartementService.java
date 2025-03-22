package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.appartement.AppartementRequest;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AppartementService {
    AppartementResponse createAppartement(AppartementRequest dto);

    AppartementResponse updateAppartement(Long id, AppartementRequest dto);

    AppartementResponse getAppartementById(Long id);

    Page<AppartementResponse> getAllAppartements(Pageable pageable);

    void deleteAppartement(Long id);

    List<AppartementResponse> getAppartementsByProprietaire(Long proprietaireId);

    /**
     * Récupère tous les appartements d'un immeuble spécifique
     * @param immeubleId l'identifiant de l'immeuble
     * @return liste des appartements associés à l'immeuble
     */
    List<AppartementResponse> getAppartementsByImmeuble(Long immeubleId);

    AppartementResponse createAppartementForProprietaire(Long proprietaireId, AppartementRequest dto);
}
