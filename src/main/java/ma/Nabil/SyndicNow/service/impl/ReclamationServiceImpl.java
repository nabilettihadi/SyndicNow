package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationCreateDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationUpdateDTO;
import ma.Nabil.SyndicNow.mapper.ReclamationMapper;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.entities.Reclamation;
import ma.Nabil.SyndicNow.repository.CopropriétaireRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.ReclamationRepository;
import ma.Nabil.SyndicNow.service.ReclamationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class ReclamationServiceImpl implements ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final CopropriétaireRepository copropriétaireRepository;
    private final ImmeubleRepository immeubleRepository;
    private final ReclamationMapper reclamationMapper;

    @Override
    public ReclamationDTO createReclamation(ReclamationCreateDTO createDTO) {
        Reclamation reclamation = reclamationMapper.toEntity(createDTO);
        
        if (createDTO.getCopropriétaireId() != null) {
            Copropriétaire copropriétaire = copropriétaireRepository.findById(createDTO.getCopropriétaireId())
                    .orElseThrow(() -> new EntityNotFoundException("Copropriétaire not found with id: " + createDTO.getCopropriétaireId()));
            reclamation.setCopropriétaire(copropriétaire);
        }
        
        if (createDTO.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(createDTO.getImmeubleId())
                    .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + createDTO.getImmeubleId()));
            reclamation.setImmeuble(immeuble);
        }
        
        reclamation = reclamationRepository.save(reclamation);
        return reclamationMapper.toDto(reclamation);
    }

    @Override
    public ReclamationDTO updateReclamation(Long id, ReclamationUpdateDTO updateDTO) {
        Reclamation existingReclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reclamation not found with id: " + id));
        
        reclamationMapper.updateEntity(updateDTO, existingReclamation);
        
        if (updateDTO.getCopropriétaireId() != null) {
            Copropriétaire copropriétaire = copropriétaireRepository.findById(updateDTO.getCopropriétaireId())
                    .orElseThrow(() -> new EntityNotFoundException("Copropriétaire not found with id: " + updateDTO.getCopropriétaireId()));
            existingReclamation.setCopropriétaire(copropriétaire);
        }
        
        if (updateDTO.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(updateDTO.getImmeubleId())
                    .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + updateDTO.getImmeubleId()));
            existingReclamation.setImmeuble(immeuble);
        }
        
        existingReclamation = reclamationRepository.save(existingReclamation);
        return reclamationMapper.toDto(existingReclamation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReclamationDTO getReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .map(reclamationMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Reclamation not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReclamationDTO> getAllReclamations(Pageable pageable) {
        return reclamationRepository.findAll(pageable)
                .map(reclamationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReclamationDTO> getReclamationsByCopropriétaire(Long copropriétaireId, Pageable pageable) {
        return reclamationRepository.findByCopropriétaireId(copropriétaireId, pageable)
                .map(reclamationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReclamationDTO> getReclamationsByImmeuble(Long immeubleId, Pageable pageable) {
        return reclamationRepository.findByImmeubleId(immeubleId, pageable)
                .map(reclamationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReclamationDTO> getReclamationsByStatus(String status, Pageable pageable) {
        return reclamationRepository.findByStatus(status, pageable)
                .map(reclamationMapper::toDto);
    }

    @Override
    public void deleteReclamation(Long id) {
        if (!reclamationRepository.existsById(id)) {
            throw new EntityNotFoundException("Reclamation not found with id: " + id);
        }
        reclamationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return reclamationRepository.existsById(id);
    }

    @Override
    public ReclamationDTO changeStatus(Long id, String newStatus) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reclamation not found with id: " + id));
        
        reclamation.setStatus(newStatus);
        reclamation = reclamationRepository.save(reclamation);
        return reclamationMapper.toDto(reclamation);
    }
}
