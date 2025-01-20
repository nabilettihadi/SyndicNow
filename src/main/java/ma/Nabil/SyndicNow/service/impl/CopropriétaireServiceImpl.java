package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireCreateDTO;
import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireDTO;
import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireUpdateDTO;
import ma.Nabil.SyndicNow.mapper.CopropriétaireMapper;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.CopropriétaireRepository;
import ma.Nabil.SyndicNow.service.CopropriétaireService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class CopropriétaireServiceImpl implements CopropriétaireService {

    private final CopropriétaireRepository copropriétaireRepository;
    private final AppartementRepository appartementRepository;
    private final CopropriétaireMapper copropriétaireMapper;

    @Override
    public CopropriétaireDTO createCopropriétaire(CopropriétaireCreateDTO createDTO) {
        Copropriétaire copropriétaire = copropriétaireMapper.toEntity(createDTO);
        
        // Vérifier et associer l'appartement
        if (createDTO.getAppartementId() != null) {
            Appartement appartement = appartementRepository.findById(createDTO.getAppartementId())
                    .orElseThrow(() -> new EntityNotFoundException("Appartement not found with id: " + createDTO.getAppartementId()));
            copropriétaire.setAppartement(appartement);
        }
        
        copropriétaire = copropriétaireRepository.save(copropriétaire);
        return copropriétaireMapper.toDto(copropriétaire);
    }

    @Override
    public CopropriétaireDTO updateCopropriétaire(Long id, CopropriétaireUpdateDTO updateDTO) {
        Copropriétaire existingCopropriétaire = copropriétaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Copropriétaire not found with id: " + id));
        
        copropriétaireMapper.updateEntity(updateDTO, existingCopropriétaire);
        
        // Mettre à jour l'appartement si nécessaire
        if (updateDTO.getAppartementId() != null) {
            Appartement appartement = appartementRepository.findById(updateDTO.getAppartementId())
                    .orElseThrow(() -> new EntityNotFoundException("Appartement not found with id: " + updateDTO.getAppartementId()));
            existingCopropriétaire.setAppartement(appartement);
        }
        
        existingCopropriétaire = copropriétaireRepository.save(existingCopropriétaire);
        return copropriétaireMapper.toDto(existingCopropriétaire);
    }

    @Override
    @Transactional(readOnly = true)
    public CopropriétaireDTO getCopropriétaireById(Long id) {
        return copropriétaireRepository.findById(id)
                .map(copropriétaireMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Copropriétaire not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CopropriétaireDTO> getAllCopropriétaires(Pageable pageable) {
        return copropriétaireRepository.findAll(pageable)
                .map(copropriétaireMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CopropriétaireDTO> getCopropriétairesByAppartement(Long appartementId, Pageable pageable) {
        return copropriétaireRepository.findByAppartementId(appartementId, pageable)
                .map(copropriétaireMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CopropriétaireDTO> getCopropriétairesByImmeuble(Long immeubleId, Pageable pageable) {
        return copropriétaireRepository.findByAppartementImmeubleId(immeubleId, pageable)
                .map(copropriétaireMapper::toDto);
    }

    @Override
    public void deleteCopropriétaire(Long id) {
        if (!copropriétaireRepository.existsById(id)) {
            throw new EntityNotFoundException("Copropriétaire not found with id: " + id);
        }
        copropriétaireRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return copropriétaireRepository.existsById(id);
    }
}
