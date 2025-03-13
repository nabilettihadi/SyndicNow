package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.ImmeubleMapper;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.service.ImmeubleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImmeubleServiceImpl implements ImmeubleService {

    private final ImmeubleRepository immeubleRepository;
    private final ImmeubleMapper immeubleMapper;

    @Autowired
    public ImmeubleServiceImpl(ImmeubleRepository immeubleRepository, ImmeubleMapper immeubleMapper) {
        this.immeubleRepository = immeubleRepository;
        this.immeubleMapper = immeubleMapper;
    }

    @Override
    public List<ImmeubleResponse> getAllImmeubles() {
        return immeubleRepository.findAll().stream()
                .map(immeubleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ImmeubleResponse getImmeubleById(Long id) {
        Immeuble immeuble = immeubleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé avec l'id: " + id));
        return immeubleMapper.toResponse(immeuble);
    }

    @Override
    public List<ImmeubleResponse> getImmeublesBySyndic(Long syndicId) {
        return immeubleRepository.findBySyndicId(syndicId).stream()
                .map(immeubleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ImmeubleResponse createImmeuble(ImmeubleRequest request) {
        Immeuble immeuble = immeubleMapper.toEntity(request);
        Immeuble savedImmeuble = immeubleRepository.save(immeuble);
        return immeubleMapper.toResponse(savedImmeuble);
    }

    @Override
    public ImmeubleResponse updateImmeuble(Long id, ImmeubleRequest request) {
        Immeuble existingImmeuble = immeubleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé avec l'id: " + id));
        
        immeubleMapper.updateEntityFromRequest(request, existingImmeuble);
        Immeuble updatedImmeuble = immeubleRepository.save(existingImmeuble);
        return immeubleMapper.toResponse(updatedImmeuble);
    }

    @Override
    public void deleteImmeuble(Long id) {
        if (!immeubleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Immeuble non trouvé avec l'id: " + id);
        }
        immeubleRepository.deleteById(id);
    }
}
