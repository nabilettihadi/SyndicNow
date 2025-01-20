package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleCreateDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleUpdateDTO;
import ma.Nabil.SyndicNow.mapper.ImmeubleMapper;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.ImmeubleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class ImmeubleServiceImpl implements ImmeubleService {

    private final ImmeubleRepository immeubleRepository;
    private final SyndicRepository syndicRepository;
    private final ImmeubleMapper immeubleMapper;

    @Override
    public ImmeubleDTO createImmeuble(ImmeubleCreateDTO createDTO) {
        Immeuble immeuble = immeubleMapper.toEntity(createDTO);
        
        // Vérifier et associer le syndic
        if (createDTO.getSyndicId() != null) {
            Syndic syndic = syndicRepository.findById(createDTO.getSyndicId())
                    .orElseThrow(() -> new EntityNotFoundException("Syndic not found with id: " + createDTO.getSyndicId()));
            immeuble.setSyndic(syndic);
        }
        
        immeuble = immeubleRepository.save(immeuble);
        return immeubleMapper.toDto(immeuble);
    }

    @Override
    public ImmeubleDTO updateImmeuble(Long id, ImmeubleUpdateDTO updateDTO) {
        Immeuble existingImmeuble = immeubleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + id));
        
        immeubleMapper.updateEntity(updateDTO, existingImmeuble);
        
        // Mettre à jour le syndic si nécessaire
        if (updateDTO.getSyndicId() != null) {
            Syndic syndic = syndicRepository.findById(updateDTO.getSyndicId())
                    .orElseThrow(() -> new EntityNotFoundException("Syndic not found with id: " + updateDTO.getSyndicId()));
            existingImmeuble.setSyndic(syndic);
        }
        
        existingImmeuble = immeubleRepository.save(existingImmeuble);
        return immeubleMapper.toDto(existingImmeuble);
    }

    @Override
    @Transactional(readOnly = true)
    public ImmeubleDTO getImmeubleById(Long id) {
        return immeubleRepository.findById(id)
                .map(immeubleMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Immeuble not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ImmeubleDTO> getAllImmeubles(Pageable pageable) {
        return immeubleRepository.findAll(pageable)
                .map(immeubleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ImmeubleDTO> getImmeublesBySyndic(Long syndicId, Pageable pageable) {
        return immeubleRepository.findBySyndicId(syndicId, pageable)
                .map(immeubleMapper::toDto);
    }

    @Override
    public void deleteImmeuble(Long id) {
        if (!immeubleRepository.existsById(id)) {
            throw new EntityNotFoundException("Immeuble not found with id: " + id);
        }
        immeubleRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return immeubleRepository.existsById(id);
    }
}
