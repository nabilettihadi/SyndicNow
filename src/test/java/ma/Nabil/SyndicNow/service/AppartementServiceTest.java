package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.appartement.AppartementRequest;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.AppartementMapper;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.service.impl.AppartementServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppartementServiceTest {

    @Mock
    private AppartementRepository appartementRepository;

    @Mock
    private ImmeubleRepository immeubleRepository;

    @Mock
    private ProprietaireRepository proprietaireRepository;

    @Mock
    private AppartementMapper appartementMapper;

    @InjectMocks
    private AppartementServiceImpl appartementService;

    private Appartement appartement;
    private AppartementRequest appartementRequest;
    private AppartementResponse appartementResponse;
    private Immeuble immeuble;
    private Proprietaire proprietaire;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Création d'un immeuble pour les tests
        immeuble = new Immeuble();
        immeuble.setId(1L);
        immeuble.setNom("Immeuble Test");
        immeuble.setAdresse("123 Rue Test");
        immeuble.setVille("Casablanca");

        // Création d'un propriétaire pour les tests
        proprietaire = new Proprietaire();
        proprietaire.setId(1L);
        proprietaire.setNom("Nom Proprietaire");
        proprietaire.setPrenom("Prenom Proprietaire");
        proprietaire.setEmail("proprietaire@test.com");

        // Création d'un appartement pour les tests
        appartement = new Appartement();
        appartement.setId(1L);
        appartement.setNumero("A101");
        appartement.setEtage(1);
        appartement.setSurface(75.5);
        appartement.setNombrePieces(3);
        appartement.setDescription("Appartement test");
        appartement.setImmeuble(immeuble);
        appartement.setProprietaire(proprietaire);

        // Création d'une requête appartement pour les tests
        appartementRequest = AppartementRequest.builder()
                .numero("A101")
                .etage(1)
                .surface(75.5)
                .nombrePieces(3)
                .description("Appartement test")
                .immeubleId(1L)
                .build();

        // Création d'une réponse appartement pour les tests
        appartementResponse = AppartementResponse.builder()
                .id(1L)
                .numero("A101")
                .etage(1)
                .surface(75.5)
                .nombrePieces(3)
                .description("Appartement test")
                .build();
        
        // Création d'un objet pageable pour les tests
        pageable = Pageable.unpaged();
    }

    @Test
    void getAllAppartements_ShouldReturnPageOfAppartements() {
        // Given
        Page<Appartement> appartementPage = new PageImpl<>(Arrays.asList(appartement));
        when(appartementRepository.findAll(any(Pageable.class))).thenReturn(appartementPage);
        when(appartementMapper.toResponseDto(any(Appartement.class))).thenReturn(appartementResponse);

        // When
        Page<AppartementResponse> result = appartementService.getAllAppartements(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(appartementRepository).findAll(pageable);
        verify(appartementMapper, times(1)).toResponseDto(any(Appartement.class));
    }

    @Test
    void getAppartementById_ShouldReturnAppartement_WhenAppartementExists() {
        // Given
        when(appartementRepository.findById(anyLong())).thenReturn(Optional.of(appartement));
        when(appartementMapper.toResponseDto(appartement)).thenReturn(appartementResponse);

        // When
        AppartementResponse result = appartementService.getAppartementById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("A101", result.getNumero());
        verify(appartementRepository).findById(1L);
    }

    @Test
    void getAppartementById_ShouldThrowException_WhenAppartementDoesNotExist() {
        // Given
        when(appartementRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            appartementService.getAppartementById(1L);
        });
        verify(appartementRepository).findById(1L);
    }

    @Test
    void getAppartementsByImmeuble_ShouldReturnListOfAppartements() {
        // Given
        List<Appartement> appartements = Arrays.asList(appartement);
        when(appartementRepository.findByImmeubleId(anyLong())).thenReturn(appartements);
        when(appartementMapper.toResponseDto(any(Appartement.class))).thenReturn(appartementResponse);

        // When
        List<AppartementResponse> result = appartementService.getAppartementsByImmeuble(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("A101", result.get(0).getNumero());
        verify(appartementRepository).findByImmeubleId(1L);
        verify(appartementMapper, times(1)).toResponseDto(any(Appartement.class));
    }

    @Test
    void getAppartementsByProprietaire_ShouldReturnListOfAppartements() {
        // Given
        List<Appartement> appartements = Arrays.asList(appartement);
        when(appartementRepository.findByProprietaireId(anyLong())).thenReturn(appartements);
        when(appartementMapper.toResponseDto(any(Appartement.class))).thenReturn(appartementResponse);

        // When
        List<AppartementResponse> result = appartementService.getAppartementsByProprietaire(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("A101", result.get(0).getNumero());
        verify(appartementRepository).findByProprietaireId(1L);
        verify(appartementMapper, times(1)).toResponseDto(any(Appartement.class));
    }

    @Test
    void createAppartement_ShouldReturnCreatedAppartement() {
        // Given
        when(appartementMapper.toEntity(any(AppartementRequest.class))).thenReturn(appartement);
        when(appartementRepository.save(any(Appartement.class))).thenReturn(appartement);
        when(appartementMapper.toResponseDto(any(Appartement.class))).thenReturn(appartementResponse);

        // When
        AppartementResponse result = appartementService.createAppartement(appartementRequest);

        // Then
        assertNotNull(result);
        assertEquals("A101", result.getNumero());
        verify(appartementMapper).toEntity(appartementRequest);
        verify(appartementRepository).save(appartement);
        verify(appartementMapper).toResponseDto(appartement);
    }

    @Test
    void updateAppartement_ShouldReturnUpdatedAppartement_WhenAppartementExists() {
        // Given
        when(appartementRepository.findById(anyLong())).thenReturn(Optional.of(appartement));
        when(appartementRepository.save(any(Appartement.class))).thenReturn(appartement);
        when(appartementMapper.toResponseDto(any(Appartement.class))).thenReturn(appartementResponse);
        doNothing().when(appartementMapper).updateEntityFromDto(any(AppartementRequest.class), any(Appartement.class));

        // When
        AppartementResponse result = appartementService.updateAppartement(1L, appartementRequest);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("A101", result.getNumero());
        verify(appartementRepository).findById(1L);
        verify(appartementMapper).updateEntityFromDto(appartementRequest, appartement);
        verify(appartementRepository).save(appartement);
        verify(appartementMapper).toResponseDto(appartement);
    }
} 