package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementUpdateDTO;
import ma.Nabil.SyndicNow.mapper.AppartementMapper;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.service.AppartementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class AppartementServiceImpl implements AppartementService {

    private final AppartementRepository appartementRepository;
    private final ImmeubleRepository immeubleRepository;
    private final AppartementMapper appartementMapper;

    @Override
    public AppartementDTO createAppartement(AppartementCreateDTO createDTO) {
        Appartement appartement = appartementMapper.toEntity(createDTO);
        
        // Vérifier et associer l'immeuble
        if (createDTO.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(createDTO.getImmeubleId())
                    .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + createDTO.getImmeubleId()));
            appartement.setImmeuble(immeuble);
        }
        
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toDto(appartement);
    }

    @Override
    public AppartementDTO updateAppartement(Long id, AppartementUpdateDTO updateDTO) {
        Appartement existingAppartement = appartementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appartement not found with id: " + id));
        
        appartementMapper.updateEntity(updateDTO, existingAppartement);
        
        // Mettre à jour l'immeuble si nécessaire
        if (updateDTO.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(updateDTO.getImmeubleId())
                    .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + updateDTO.getImmeubleId()));
            existingAppartement.setImmeuble(immeuble);
        }
        
        existingAppartement = appartementRepository.save(existingAppartement);
        return appartementMapper.toDto(existingAppartement);
    }

    @Override
    @Transactional(readOnly = true)
    public AppartementDTO getAppartementById(Long id) {
        return appartementRepository.findById(id)
                .map(appartementMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Appartement not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppartementDTO> getAllAppartements(Pageable pageable) {
        return appartementRepository.findAll(pageable)
                .map(appartementMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppartementDTO> getAppartementsByImmeuble(Long immeubleId, Pageable pageable) {
        return appartementRepository.findByImmeubleId(immeubleId, pageable)
                .map(appartementMapper::toDto);
    }

    @Override
    public void deleteAppartement(Long id) {
        if (!appartementRepository.existsById(id)) {
            throw new EntityNotFoundException("Appartement not found with id: " + id);
        }
        appartementRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return appartementRepository.existsById(id);
    }
}
