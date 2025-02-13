package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.intervention.InterventionDTO;
import ma.Nabil.SyndicNow.dto.intervention.InterventionCreateDTO;
import ma.Nabil.SyndicNow.dto.intervention.InterventionUpdateDTO;
import ma.Nabil.SyndicNow.dto.intervention.ValidationInterventionDTO;
import ma.Nabil.SyndicNow.model.entities.Intervention;
import ma.Nabil.SyndicNow.model.entities.ActionIntervention;
import org.mapstruct.*;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {DocumentMapper.class},
        imports = {Date.class})
public interface InterventionMapper {
    
    @Mapping(target = "equipementId", source = "equipement.id")
    @Mapping(target = "equipementNom", source = "equipement.nom")
    @Mapping(target = "equipementReference", source = "equipement.reference")
    @Mapping(target = "immeubleId", source = "equipement.immeuble.id")
    @Mapping(target = "immeubleNom", source = "equipement.immeuble.nom")
    @Mapping(target = "resolutionId", source = "resolution.id")
    @Mapping(target = "resolutionReference", source = "resolution.reference")
    @Mapping(target = "coutTotal", expression = "java(calculerCoutTotal(intervention))")
    @Mapping(target = "historiqueActions", expression = "java(mapHistoriqueActions(intervention))")
    InterventionDTO toDto(Intervention intervention);
    
    List<InterventionDTO> toDtoList(List<Intervention> interventions);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(interventionCreateDTO))")
    @Mapping(target = "statut", constant = "PLANIFIEE")
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "equipement", ignore = true)
    @Mapping(target = "resolution", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Intervention toEntity(InterventionCreateDTO interventionCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "equipement", ignore = true)
    @Mapping(target = "resolution", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateInterventionFromDto(InterventionUpdateDTO interventionUpdateDTO, @MappingTarget Intervention intervention);
    
    default double calculerCoutTotal(Intervention intervention) {
        double coutMateriel = intervention.getCoutMateriel() != null ? intervention.getCoutMateriel() : 0;
        double coutMainOeuvre = intervention.getCoutMainOeuvre() != null ? intervention.getCoutMainOeuvre() : 0;
        return coutMateriel + coutMainOeuvre;
    }
    
    default List<InterventionDTO.ActionInterventionDTO> mapHistoriqueActions(Intervention intervention) {
        if (intervention.getHistoriqueActions() == null) return List.of();
        return intervention.getHistoriqueActions().stream()
                .map(a -> {
                    InterventionDTO.ActionInterventionDTO dto = new InterventionDTO.ActionInterventionDTO();
                    dto.setDate(a.getDate());
                    dto.setAuteur(a.getAuteur());
                    dto.setAction(a.getAction());
                    dto.setDescription(a.getDescription());
                    dto.setStatutPrecedent(a.getStatutPrecedent());
                    dto.setNouveauStatut(a.getNouveauStatut());
                    dto.setCommentaire(a.getCommentaire());
                    return dto;
                })
                .sorted(Comparator.comparing(InterventionDTO.ActionInterventionDTO::getDate))
                .collect(Collectors.toList());
    }
    
    default String generateReference(InterventionCreateDTO dto) {
        return String.format("INT-%s-%d-%d",
            dto.getType().name().substring(0, 3),
            dto.getEquipementId(),
            System.currentTimeMillis() % 10000
        ).toUpperCase();
    }
    
    @AfterMapping
    default void handleStatutChanges(@MappingTarget Intervention intervention, InterventionUpdateDTO dto) {
        if (dto.getStatut() != null && dto.getStatut() != intervention.getStatut()) {
            ActionIntervention action = new ActionIntervention();
            action.setDate(new Date());
            action.setAction("CHANGEMENT_STATUT");
            action.setStatutPrecedent(intervention.getStatut());
            action.setNouveauStatut(dto.getStatut());
            action.setCommentaire(dto.getCommentaireMiseAJour());
            
            if (intervention.getHistoriqueActions() == null) {
                intervention.setHistoriqueActions(List.of(action));
            } else {
                intervention.getHistoriqueActions().add(action);
            }
            
            // Mise à jour des dates selon le statut
            switch (dto.getStatut()) {
            case IN_PROGRESS -> intervention.setDateDebut(new Date());
            case COMPLETED -> intervention.setDateFin(new Date());

            }
        }
    }
    
    @AfterMapping
    default void handleValidation(@MappingTarget Intervention intervention, ValidationInterventionDTO dto) {
        if (dto.isValide()) {
            intervention.setValidePar(dto.getCommentaires());
            intervention.setDateValidation(new Date());
            intervention.setCommentairesValidation(dto.getCommentaires());
            
            ActionIntervention action = new ActionIntervention();
            action.setDate(new Date());
            action.setAction("VALIDATION");
            action.setCommentaire(dto.getCommentaires());
            
            if (intervention.getHistoriqueActions() == null) {
                intervention.setHistoriqueActions(List.of(action));
            } else {
                intervention.getHistoriqueActions().add(action);
            }
        }
    }
}
