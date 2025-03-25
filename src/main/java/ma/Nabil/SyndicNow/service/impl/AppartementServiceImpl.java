package ma.Nabil.SyndicNow.service.impl;

import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.appartement.AppartementRequest;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.AppartementMapper;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.service.AppartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class AppartementServiceImpl implements AppartementService {

    @Autowired
    private AppartementRepository appartementRepository;

    @Autowired
    private AppartementMapper appartementMapper;

    @Autowired
    private ProprietaireRepository proprietaireRepository;

    @Autowired
    private ImmeubleRepository immeubleRepository;

    @Override
    @Transactional
    public AppartementResponse createAppartement(AppartementRequest dto) {
        Appartement appartement = appartementMapper.toEntity(dto);
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    @Transactional
    public AppartementResponse updateAppartement(Long id, AppartementRequest dto) {
        Appartement appartement = appartementRepository.findById(id).orElseThrow(() -> new RuntimeException("Appartement not found"));
        appartementMapper.updateEntityFromDto(dto, appartement);
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    @Transactional(readOnly = true)
    public AppartementResponse getAppartementById(Long id) {
        Appartement appartement = appartementRepository.findById(id).orElseThrow(() -> new RuntimeException("Appartement not found"));
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppartementResponse> getAllAppartements(Pageable pageable) {
        return appartementRepository.findAll(pageable).map(appartementMapper::toResponseDto);
    }

    @Override
    @Transactional
    public void deleteAppartement(Long id) {
        if (!appartementRepository.existsById(id)) {
            throw new RuntimeException("Appartement not found");
        }
        appartementRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppartementResponse> getAppartementsByProprietaire(Long proprietaireId) {
        log.debug("Fetching apartments for proprietaire with ID: {}", proprietaireId);
        List<Appartement> appartements = appartementRepository.findByProprietaireId(proprietaireId);
        log.debug("Found {} apartments for proprietaire {}", appartements.size(), proprietaireId);
        return appartements.stream()
                .map(appartementMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppartementResponse> getAppartementsByImmeuble(Long immeubleId) {
        List<Appartement> appartements = appartementRepository.findByImmeubleId(immeubleId);
        return appartements.stream()
                .map(appartementMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppartementResponse createAppartementForProprietaire(Long proprietaireId, AppartementRequest dto) {
        Proprietaire proprietaire = proprietaireRepository.findById(proprietaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Proprietaire not found"));
        
        Immeuble immeuble = immeubleRepository.findById(dto.getImmeubleId())
                .orElseThrow(() -> new ResourceNotFoundException("Immeuble not found with id: " + dto.getImmeubleId()));

        Appartement appartement = appartementMapper.toEntity(dto);
        appartement.setProprietaire(proprietaire);
        appartement.setImmeuble(immeuble);
        
        // Ajouter l'appartement à la liste des appartements de l'immeuble
        immeuble.addAppartement(appartement);
        
        // Ajouter l'appartement à la liste des appartements du propriétaire
        proprietaire.addAppartement(appartement);
        
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    @Transactional
    public void deleteAppartementForProprietaire(Long proprietaireId, Long appartementId) {
        Appartement appartement = appartementRepository.findById(appartementId)
                .orElseThrow(() -> new ResourceNotFoundException("Appartement non trouvé avec l'id: " + appartementId));

        // Vérifier que l'appartement appartient bien au propriétaire
        if (!appartement.getProprietaire().getId().equals(proprietaireId)) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à supprimer cet appartement");
        }

        appartementRepository.delete(appartement);
    }
}
