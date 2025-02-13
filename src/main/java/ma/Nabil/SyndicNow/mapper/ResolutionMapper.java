package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.resolution.ResolutionDTO;
import ma.Nabil.SyndicNow.dto.resolution.ResolutionCreateDTO;
import ma.Nabil.SyndicNow.dto.resolution.ResolutionUpdateDTO;
import ma.Nabil.SyndicNow.dto.resolution.ValidationResolutionDTO;
import ma.Nabil.SyndicNow.model.entities.Resolution;
import ma.Nabil.SyndicNow.model.entities.MiseAJour;
import org.mapstruct.*;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {DocumentMapper.class},
        imports = {Date.class})
public interface ResolutionMapper {
    
    @Mapping(target = "reclamationId", source = "reclamation.id")
    @Mapping(target = "reclamationReference", source = "reclamation.reference")
    @Mapping(target = "responsableId", source = "responsable.id")
    @Mapping(target = "responsableNom", source = "responsable.nom")
    @Mapping(target = "immeubleId", source = "reclamation.appartement.immeuble.id")
    @Mapping(target = "immeubleNom", source = "reclamation.appartement.immeuble.nom")
    @Mapping(target = "historiqueMisesAJour", expression = "java(mapHistoriqueMisesAJour(resolution))")
    ResolutionDTO toDto(Resolution resolution);
    
    List<ResolutionDTO> toDtoList(List<Resolution> resolutions);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(resolutionCreateDTO))")
    @Mapping(target = "statut", constant = "EN_COURS")
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "reclamation", ignore = true)
    @Mapping(target = "responsable", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Resolution toEntity(ResolutionCreateDTO resolutionCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "reclamation", ignore = true)
    @Mapping(target = "responsable", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateResolutionFromDto(ResolutionUpdateDTO resolutionUpdateDTO, @MappingTarget Resolution resolution);
    
    default List<ResolutionDTO.MiseAJourDTO> mapHistoriqueMisesAJour(Resolution resolution) {
        if (resolution.getHistoriqueMisesAJour() == null) return List.of();
        return resolution.getHistoriqueMisesAJour().stream()
                .map(m -> {
                    ResolutionDTO.MiseAJourDTO dto = new ResolutionDTO.MiseAJourDTO();
                    dto.setDate(m.getDate());
                    dto.setAuteur(m.getAuteur());
                    dto.setDescription(m.getDescription());
                    dto.setProgressionPrecedente(m.getProgressionPrecedente());
                    dto.setNouvelleProgression(m.getNouvelleProgression());
                    dto.setNouveauStatut(m.getNouveauStatut());
                    dto.setCommentaire(m.getCommentaire());
                    return dto;
                })
                .sorted(Comparator.comparing(ResolutionDTO.MiseAJourDTO::getDate))
                .collect(Collectors.toList());
    }
    
    default String generateReference(ResolutionCreateDTO dto) {
        return String.format("RES-%s-%d-%d",
            dto.getType().name().substring(0, 3),
            dto.getReclamationId(),
            System.currentTimeMillis() % 10000
        ).toUpperCase();
    }
    
    @AfterMapping
    default void handleCompletion(@MappingTarget Resolution resolution, ResolutionUpdateDTO dto) {
        if (dto.getStatut() != null && 
            dto.getStatut().name().contains("TERMINE") && 
            resolution.getDateCompletion() == null) {
            resolution.setDateCompletion(new Date());
        }
    }
    
    @AfterMapping
    default void handleValidation(@MappingTarget Resolution resolution, ValidationResolutionDTO dto) {
        if (dto.isValide()) {
            resolution.setValidePar(dto.getCommentaires());
            resolution.setDateValidation(new Date());
            resolution.setCommentairesValidation(dto.getCommentaires());
        }
    }
    
    @AfterMapping
    default void addMiseAJour(@MappingTarget Resolution resolution, ResolutionUpdateDTO dto) {
        if (dto.getCommentaireMiseAJour() != null || 
            dto.getProgression() != null || 
            dto.getStatut() != null) {
            
            MiseAJour miseAJour = new MiseAJour();
            miseAJour.setDate(new Date());
            // L'auteur sera défini par le service
            miseAJour.setDescription(dto.getCommentaireMiseAJour());
            
            if (dto.getProgression() != null) {
                miseAJour.setProgressionPrecedente(resolution.getProgression());
                miseAJour.setNouvelleProgression(dto.getProgression());
            }
            
            if (dto.getStatut() != null) {
                miseAJour.setNouveauStatut(dto.getStatut());
            }
            
            if (resolution.getHistoriqueMisesAJour() == null) {
                resolution.setHistoriqueMisesAJour(List.of(miseAJour));
            } else {
                resolution.getHistoriqueMisesAJour().add(miseAJour);
            }
        }
    }
}
