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

    AppartementResponse createAppartementForProprietaire(Long proprietaireId, AppartementRequest dto);
}
