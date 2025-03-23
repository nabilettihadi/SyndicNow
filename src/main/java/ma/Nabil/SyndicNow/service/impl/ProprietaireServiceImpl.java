package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.ProprietaireMapper;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.service.ProprietaireService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProprietaireServiceImpl implements ProprietaireService {

    private final ProprietaireRepository proprietaireRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProprietaireMapper proprietaireMapper;

    @Override
    @Transactional
    public ProprietaireResponse createProprietaire(ProprietaireRequest request) {
        Proprietaire proprietaire = proprietaireMapper.toEntity(request);
        
        // Encoder le mot de passe
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            proprietaire.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Définir le rôle
        proprietaire.setRole(Role.PROPRIETAIRE);
        
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    @Transactional
    public ProprietaireResponse updateProprietaire(Long id, ProprietaireRequest request) {
        Proprietaire proprietaire = proprietaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Propriétaire non trouvé avec l'ID: " + id));

        proprietaireMapper.updateEntityFromDto(request, proprietaire);
        
        // Encoder le mot de passe si fourni
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            proprietaire.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }
    
    @Override
    @Transactional
    public ProprietaireResponse updateProfile(ProprietaireRequest request) {
        // Récupérer l'utilisateur authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Récupérer le propriétaire par email
        Proprietaire proprietaire = proprietaireRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur connecté non trouvé"));
        
        // Mettre à jour uniquement les champs non null
        if (request.getNom() != null) proprietaire.setNom(request.getNom());
        if (request.getPrenom() != null) proprietaire.setPrenom(request.getPrenom());
        
        // Ne pas permettre de changer l'email car c'est l'identifiant
        
        // Encoder le mot de passe si fourni
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            proprietaire.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Mettre à jour les autres champs uniquement s'ils sont fournis
        if (request.getTelephone() != null) proprietaire.setTelephone(request.getTelephone());
        if (request.getAdresse() != null) proprietaire.setAdresse(request.getAdresse());
        if (request.getCin() != null) proprietaire.setCin(request.getCin());
        
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    @Transactional(readOnly = true)
    public ProprietaireResponse getProprietaireById(Long id) {
        Proprietaire proprietaire = proprietaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Propriétaire non trouvé avec l'ID: " + id));
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProprietaireResponse> getAllProprietaires() {
        return proprietaireRepository.findAll().stream()
                .map(proprietaireMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProprietaire(Long id) {
        if (!proprietaireRepository.existsById(id)) {
            throw new ResourceNotFoundException("Propriétaire non trouvé avec l'ID: " + id);
        }
        proprietaireRepository.deleteById(id);
    }
}
