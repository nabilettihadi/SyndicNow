package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.SyndicMapper;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.SyndicService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyndicServiceImpl implements SyndicService {

    private final SyndicRepository syndicRepository;
    private final PasswordEncoder passwordEncoder;
    private final SyndicMapper syndicMapper;

    @Override
    @Transactional
    public SyndicResponse createSyndic(SyndicRequest request) {
        Syndic syndic = syndicMapper.toEntity(request);
        
        // Encoder le mot de passe
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            syndic.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Définir le rôle
        syndic.setRole(Role.SYNDIC);
        
        syndic = syndicRepository.save(syndic);
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    @Transactional
    public SyndicResponse updateSyndic(Long id, SyndicRequest request) {
        Syndic syndic = syndicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id));

        syndicMapper.updateEntityFromDto(request, syndic);
        
        // Encoder le mot de passe si fourni
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            syndic.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        syndic = syndicRepository.save(syndic);
        return syndicMapper.toResponseDto(syndic);
    }
    
    @Override
    @Transactional
    public SyndicResponse updateProfile(SyndicRequest request) {
        // Récupérer l'utilisateur authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Récupérer le syndic par email
        Syndic syndic = syndicRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur connecté non trouvé"));
        
        // Mettre à jour uniquement les champs non null
        if (request.getNom() != null) syndic.setNom(request.getNom());
        if (request.getPrenom() != null) syndic.setPrenom(request.getPrenom());
        
        // Ne pas permettre de changer l'email car c'est l'identifiant
        
        // Encoder le mot de passe si fourni
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            syndic.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Mettre à jour les autres champs uniquement s'ils sont fournis
        if (request.getTelephone() != null) syndic.setTelephone(request.getTelephone());
        if (request.getAdresse() != null) syndic.setAdresse(request.getAdresse());
        if (request.getNumeroLicence() != null) syndic.setNumeroLicence(request.getNumeroLicence());
        if (request.getSociete() != null) syndic.setSociete(request.getSociete());
        if (request.getCin() != null) syndic.setCin(request.getCin());
        if (request.getSiret() != null) {
            // Vérifier que le SIRET est au bon format
            if (request.getSiret().matches("^[0-9]{14}$")) {
                syndic.setSiret(request.getSiret());
            }
        }
        
        syndic = syndicRepository.save(syndic);
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    @Transactional(readOnly = true)
    public SyndicResponse getSyndicById(Long id) {
        Syndic syndic = syndicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id));
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SyndicResponse> getAllSyndics() {
        return syndicRepository.findAll().stream()
                .map(syndicMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSyndic(Long id) {
        if (!syndicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id);
        }
        syndicRepository.deleteById(id);
    }
}
