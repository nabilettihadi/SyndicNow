package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.PaiementRepository;
import ma.Nabil.SyndicNow.service.NotificationService;
import ma.Nabil.SyndicNow.service.PaiementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementServiceImpl implements PaiementService {
    private final PaiementRepository paiementRepository;
    private final AppartementRepository appartementRepository;
    private final NotificationService notificationService;

    @Override
    public PaiementResponse createPaiement(PaiementRequest request) {
        Appartement appartement = appartementRepository.findById(request.getAppartementId()).orElseThrow(() -> new ResourceNotFoundException("Appartement not found"));

        Paiement paiement = Paiement.builder().montant(request.getMontant()).dateEcheance(request.getDateEcheance()).type(request.getType()).status(request.getStatus() != null ? request.getStatus() : PaiementStatus.EN_ATTENTE).appartement(appartement).description(request.getDescription()).reference(request.getReference()).build();

        paiementRepository.save(paiement);

        String message = String.format("Nouveau paiement créé pour l'appartement %s - Montant: %.2f DH - Date d'échéance: %s - Type: %s - Référence: %s", 
            paiement.getAppartement().getNumero(), 
            paiement.getMontant(), 
            paiement.getDateEcheance(), 
            paiement.getType(), 
            paiement.getReference());
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            notificationService.sendEmailNotification(proprietaire.getEmail(), "Nouveau paiement", message);
        });

        return toPaiementResponse(paiement);
    }

    @Override
    public PaiementResponse updatePaiement(Long id, PaiementRequest request) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));

        if (request.getAppartementId() != null && !request.getAppartementId().equals(paiement.getAppartement().getId())) {
            Appartement appartement = appartementRepository.findById(request.getAppartementId()).orElseThrow(() -> new ResourceNotFoundException("Appartement not found"));
            paiement.setAppartement(appartement);
        }

        paiement.setMontant(request.getMontant());
        paiement.setDateEcheance(request.getDateEcheance());
        paiement.setType(request.getType());
        if (request.getStatus() != null) {
            paiement.setStatus(request.getStatus());
        }
        paiement.setDescription(request.getDescription());
        if (request.getReference() != null) {
            paiement.setReference(request.getReference());
        }

        return toPaiementResponse(paiementRepository.save(paiement));
    }

    @Override
    public void deletePaiement(Long id) {
        if (!paiementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paiement not found");
        }
        paiementRepository.deleteById(id);
    }

    @Override
    public PaiementResponse getPaiementById(Long id) {
        return paiementRepository.findById(id).map(this::toPaiementResponse).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
    }

    @Override
    public PaiementResponse getPaiementByReference(String reference) {
        return paiementRepository.findByReference(reference).map(this::toPaiementResponse).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
    }

    @Override
    public Page<PaiementResponse> getAllPaiements(Pageable pageable) {
        return paiementRepository.findAll(pageable).map(this::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByAppartement(Long appartementId, Pageable pageable) {
        return paiementRepository.findByAppartementId(appartementId, pageable).map(this::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByStatus(PaiementStatus status, Pageable pageable) {
        return paiementRepository.findByStatus(status, pageable).map(this::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByType(PaiementType type, Pageable pageable) {
        return paiementRepository.findByType(type, pageable).map(this::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByImmeuble(Long immeubleId, Pageable pageable) {
        return paiementRepository.findByImmeubleId(immeubleId, pageable).map(this::toPaiementResponse);
    }

    @Override
    public List<PaiementResponse> getOverduePaiements() {
        return paiementRepository.findOverduePaiements(LocalDate.now()).stream().map(this::toPaiementResponse).collect(Collectors.toList());
    }

    @Override
    public Double getTotalPaiementsByStatusAndAppartement(PaiementStatus status, Long appartementId) {
        return paiementRepository.getTotalPaiementsByStatusAndAppartement(status, appartementId);
    }

    @Override
    public Double getTotalPaiementsByStatusAndImmeuble(PaiementStatus status, Long immeubleId) {
        return paiementRepository.getTotalPaiementsByStatusAndImmeuble(status, immeubleId);
    }

    @Override
    public PaiementResponse markAsPaid(Long id) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
        paiement.setStatus(PaiementStatus.PAYE);
        paiement.setDatePaiement(LocalDate.now());
        return toPaiementResponse(paiementRepository.save(paiement));
    }

    @Override
    public PaiementResponse cancelPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
        paiement.setStatus(PaiementStatus.ANNULE);
        return toPaiementResponse(paiementRepository.save(paiement));
    }

    private PaiementResponse toPaiementResponse(Paiement paiement) {
        var proprietaires = paiement.getAppartement().getProprietaires();
        var firstProprietaire = proprietaires.isEmpty() ? null : proprietaires.iterator().next();
        
        return PaiementResponse.builder()
                .id(paiement.getId())
                .montant(paiement.getMontant())
                .dateEcheance(paiement.getDateEcheance())
                .datePaiement(paiement.getDatePaiement())
                .type(paiement.getType().name())
                .status(paiement.getStatus().name())
                .appartementId(paiement.getAppartement().getId())
                .appartementNumero(paiement.getAppartement().getNumero())
                .proprietaireId(firstProprietaire != null ? firstProprietaire.getId() : null)
                .proprietaireName(firstProprietaire != null ? firstProprietaire.getNom() : null)
                .description(paiement.getDescription())
                .reference(paiement.getReference())
                .createdAt(paiement.getCreatedAt())
                .updatedAt(paiement.getUpdatedAt())
                .build();
    }
}
