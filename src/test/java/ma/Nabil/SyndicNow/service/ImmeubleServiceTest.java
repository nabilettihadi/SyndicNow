package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.ImmeubleMapper;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.impl.ImmeubleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ImmeubleServiceTest {

    @Mock
    private ImmeubleRepository immeubleRepository;

    @Mock
    private SyndicRepository syndicRepository;

    @Mock
    private ImmeubleMapper immeubleMapper;

    @InjectMocks
    private ImmeubleServiceImpl immeubleService;

    private Immeuble immeuble;
    private ImmeubleRequest immeubleRequest;
    private ImmeubleResponse immeubleResponse;
    private Syndic syndic;

    @BeforeEach
    void setUp() {
        // Création d'un syndic pour les tests
        syndic = Syndic.builder()
                .id(1L)
                .siret("123456789")
                .societe("Syndic Test")
                .build();

        // Création d'un immeuble pour les tests
        immeuble = new Immeuble();
        immeuble.setId(1L);
        immeuble.setNom("Immeuble Test");
        immeuble.setAdresse("123 Rue Test");
        immeuble.setVille("Casablanca");
        immeuble.setCodePostal("20000");
        immeuble.setNombreEtages(5);
        immeuble.setNombreAppartements(10);
        immeuble.setAnneeConstruction(2010);
        immeuble.setDescription("Description test");
        immeuble.setSyndic(syndic);

        // Création d'une requête immeuble pour les tests
        immeubleRequest = ImmeubleRequest.builder()
                .nom("Immeuble Test")
                .adresse("123 Rue Test")
                .ville("Casablanca")
                .codePostal("20000")
                .nombreEtages(5)
                .nombreAppartements(10)
                .anneeConstruction(2010)
                .description("Description test")
                .syndicId(1L)
                .build();

        // Création d'une réponse immeuble pour les tests
        immeubleResponse = ImmeubleResponse.builder()
                .id(1L)
                .nom("Immeuble Test")
                .adresse("123 Rue Test")
                .ville("Casablanca")
                .codePostal("20000")
                .nombreEtages(5)
                .nombreAppartements(10)
                .anneeConstruction(2010)
                .description("Description test")
                .syndicId(1L)
                .build();
    }

    @Test
    void getAllImmeubles_ShouldReturnListOfImmeubles() {
        // Given
        List<Immeuble> immeubles = Arrays.asList(immeuble);
        when(immeubleRepository.findAll()).thenReturn(immeubles);
        when(immeubleMapper.toResponse(any(Immeuble.class))).thenReturn(immeubleResponse);

        // When
        List<ImmeubleResponse> result = immeubleService.getAllImmeubles();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Immeuble Test", result.get(0).getNom());
        verify(immeubleRepository).findAll();
        verify(immeubleMapper, times(1)).toResponse(any(Immeuble.class));
    }

    @Test
    void getImmeubleById_ShouldReturnImmeuble_WhenImmeubleExists() {
        // Given
        when(immeubleRepository.findById(anyLong())).thenReturn(Optional.of(immeuble));
        when(immeubleMapper.toResponse(immeuble)).thenReturn(immeubleResponse);

        // When
        ImmeubleResponse result = immeubleService.getImmeubleById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Immeuble Test", result.getNom());
        verify(immeubleRepository).findById(1L);
    }

    @Test
    void getImmeubleById_ShouldThrowException_WhenImmeubleDoesNotExist() {
        // Given
        when(immeubleRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            immeubleService.getImmeubleById(1L);
        });
        verify(immeubleRepository).findById(1L);
    }

    @Test
    void createImmeuble_ShouldReturnCreatedImmeuble() {
        // Given
        when(immeubleMapper.toEntity(immeubleRequest)).thenReturn(immeuble);
        when(immeubleRepository.save(any(Immeuble.class))).thenReturn(immeuble);
        when(immeubleMapper.toResponse(immeuble)).thenReturn(immeubleResponse);

        // When
        ImmeubleResponse result = immeubleService.createImmeuble(immeubleRequest);

        // Then
        assertNotNull(result);
        assertEquals("Immeuble Test", result.getNom());
        verify(immeubleMapper).toEntity(immeubleRequest);
        verify(immeubleRepository).save(immeuble);
        verify(immeubleMapper).toResponse(immeuble);
    }

    @Test
    void updateImmeuble_ShouldReturnUpdatedImmeuble_WhenImmeubleExists() {
        // Given
        when(immeubleRepository.findById(anyLong())).thenReturn(Optional.of(immeuble));
        when(immeubleRepository.save(any(Immeuble.class))).thenReturn(immeuble);
        when(immeubleMapper.toResponse(immeuble)).thenReturn(immeubleResponse);
        doNothing().when(immeubleMapper).updateEntityFromRequest(any(ImmeubleRequest.class), any(Immeuble.class));

        // When
        ImmeubleResponse result = immeubleService.updateImmeuble(1L, immeubleRequest);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Immeuble Test", result.getNom());
        verify(immeubleRepository).findById(1L);
        verify(immeubleMapper).updateEntityFromRequest(immeubleRequest, immeuble);
        verify(immeubleRepository).save(immeuble);
        verify(immeubleMapper).toResponse(immeuble);
    }

    @Test
    void updateImmeuble_ShouldThrowException_WhenImmeubleDoesNotExist() {
        // Given
        when(immeubleRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            immeubleService.updateImmeuble(1L, immeubleRequest);
        });
        verify(immeubleRepository).findById(1L);
        verify(immeubleRepository, never()).save(any(Immeuble.class));
    }

    @Test
    void getImmeublesBySyndic_ShouldReturnListOfImmeubles() {
        // Given
        List<Immeuble> immeubles = Arrays.asList(immeuble);
        when(immeubleRepository.findBySyndicId(anyLong())).thenReturn(immeubles);
        when(immeubleMapper.toResponse(any(Immeuble.class))).thenReturn(immeubleResponse);

        // When
        List<ImmeubleResponse> result = immeubleService.getImmeublesBySyndic(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Immeuble Test", result.get(0).getNom());
        verify(immeubleRepository).findBySyndicId(1L);
        verify(immeubleMapper, times(1)).toResponse(any(Immeuble.class));
    }
} 