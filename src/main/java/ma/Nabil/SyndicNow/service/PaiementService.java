package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PaiementService {
    PaiementResponse createPaiement(PaiementRequest request);

    PaiementResponse updatePaiement(Long id, PaiementRequest request);

    void deletePaiement(Long id);

    PaiementResponse getPaiementById(Long id);

    PaiementResponse getPaiementByReference(String reference);

    Page<PaiementResponse> getAllPaiements(Pageable pageable);

    Page<PaiementResponse> getPaiementsByAppartement(Long appartementId, Pageable pageable);

    Page<PaiementResponse> getPaiementsByStatus(PaiementStatus status, Pageable pageable);

    Page<PaiementResponse> getPaiementsByType(PaiementType type, Pageable pageable);

    Page<PaiementResponse> getPaiementsByImmeuble(Long immeubleId, Pageable pageable);

    List<PaiementResponse> getOverduePaiements();

    Double getTotalPaiementsByStatusAndAppartement(PaiementStatus status, Long appartementId);

    Double getTotalPaiementsByStatusAndImmeuble(PaiementStatus status, Long immeubleId);

    PaiementResponse markAsPaid(Long id);

    PaiementResponse cancelPaiement(Long id);
}
