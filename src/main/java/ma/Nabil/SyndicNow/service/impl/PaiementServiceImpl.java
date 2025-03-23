package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.PaiementMapper;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.PaiementRepository;
import ma.Nabil.SyndicNow.service.PaiementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaiementServiceImpl implements PaiementService {
    private final PaiementRepository paiementRepository;
    private final AppartementRepository appartementRepository;
    private final PaiementMapper paiementMapper;

    @Override
    public PaiementResponse createPaiement(PaiementRequest request) {
        Appartement appartement = appartementRepository.findById(request.getAppartementId()).orElseThrow(() -> new ResourceNotFoundException("Appartement not found"));

        Paiement paiement = paiementMapper.toPaiement(request);
        paiement.setAppartement(appartement);
        paiement = paiementRepository.save(paiement);

        return paiementMapper.toPaiementResponse(paiement);
    }

    @Override
    public PaiementResponse updatePaiement(Long id, PaiementRequest request) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));

        if (request.getAppartementId() != null && !request.getAppartementId().equals(paiement.getAppartement().getId())) {
            Appartement appartement = appartementRepository.findById(request.getAppartementId()).orElseThrow(() -> new ResourceNotFoundException("Appartement not found"));
            paiement.setAppartement(appartement);
        }

        paiementMapper.updatePaiementFromRequest(request, paiement);
        return paiementMapper.toPaiementResponse(paiementRepository.save(paiement));
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
        return paiementRepository.findById(id).map(paiementMapper::toPaiementResponse).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
    }

    @Override
    public PaiementResponse getPaiementByReference(String reference) {
        return paiementRepository.findByReference(reference).map(paiementMapper::toPaiementResponse).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
    }

    @Override
    public Page<PaiementResponse> getAllPaiements(Pageable pageable) {
        return paiementRepository.findAll(pageable).map(paiementMapper::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByAppartement(Long appartementId, Pageable pageable) {
        return paiementRepository.findByAppartementId(appartementId, pageable).map(paiementMapper::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByStatus(PaiementStatus status, Pageable pageable) {
        return paiementRepository.findByStatus(status, pageable).map(paiementMapper::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByType(PaiementType type, Pageable pageable) {
        return paiementRepository.findByType(type, pageable).map(paiementMapper::toPaiementResponse);
    }

    @Override
    public Page<PaiementResponse> getPaiementsByImmeuble(Long immeubleId, Pageable pageable) {
        return paiementRepository.findByImmeubleId(immeubleId, pageable).map(paiementMapper::toPaiementResponse);
    }

    @Override
    public List<PaiementResponse> getOverduePaiements() {
        return paiementRepository.findOverduePaiements(LocalDate.now()).stream().map(paiementMapper::toPaiementResponse).collect(Collectors.toList());
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
        return paiementMapper.toPaiementResponse(paiementRepository.save(paiement));
    }

    @Override
    public PaiementResponse cancelPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Paiement not found"));
        paiement.setStatus(PaiementStatus.ANNULE);
        return paiementMapper.toPaiementResponse(paiementRepository.save(paiement));
    }

    @Override
    public List<PaiementResponse> getPaiementsByProprietaire(Long proprietaireId) {
        return paiementRepository.findByProprietaireId(proprietaireId).stream().map(paiementMapper::toPaiementResponse).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getPaiementStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // Statistiques globales
        long totalPaiements = paiementRepository.count();
        long paiementsEnAttente = paiementRepository.countByStatus(PaiementStatus.EN_ATTENTE);
        long paiementsValides = paiementRepository.countByStatus(PaiementStatus.PAYE);
        long paiementsRejetes = paiementRepository.countByStatus(PaiementStatus.ANNULE);

        // Montants
        BigDecimal montantTotal = paiementRepository.sumMontantByStatus(PaiementStatus.PAYE);
        BigDecimal montantMoisCourant = paiementRepository.sumMontantByStatusAndMonth(PaiementStatus.PAYE, YearMonth.now().atDay(1), YearMonth.now().atEndOfMonth());

        // Statistiques par mois (derniers 12 mois)
        Map<String, BigDecimal> parMois = new LinkedHashMap<>();
        YearMonth currentMonth = YearMonth.now();
        for (int i = 0; i < 12; i++) {
            YearMonth month = currentMonth.minusMonths(i);
            BigDecimal montant = paiementRepository.sumMontantByStatusAndMonth(PaiementStatus.PAYE, month.atDay(1), month.atEndOfMonth());
            parMois.put(month.toString(), montant != null ? montant : BigDecimal.ZERO);
        }

        // Construction de la réponse
        statistics.put("totalPaiements", totalPaiements);
        statistics.put("paiementsEnAttente", paiementsEnAttente);
        statistics.put("paiementsValides", paiementsValides);
        statistics.put("paiementsRejetes", paiementsRejetes);
        statistics.put("montantTotal", montantTotal != null ? montantTotal : BigDecimal.ZERO);
        statistics.put("montantMoisCourant", montantMoisCourant != null ? montantMoisCourant : BigDecimal.ZERO);
        statistics.put("parMois", parMois);

        return statistics;
    }

    @Override
    public List<PaiementResponse> getPaiementsBySyndic(Long syndicId) {
        List<Paiement> paiements = paiementRepository.findBySyndicId(syndicId);
        return paiements.stream()
                .map(paiementMapper::toPaiementResponse)
                .collect(Collectors.toList());
    }
}