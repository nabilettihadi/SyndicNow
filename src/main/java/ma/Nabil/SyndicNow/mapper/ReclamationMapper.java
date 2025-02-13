package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.reclamation.ReclamationDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationCreateDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationUpdateDTO;
import ma.Nabil.SyndicNow.dto.reclamation.CommentaireReclamationDTO;
import ma.Nabil.SyndicNow.model.entities.Reclamation;
import ma.Nabil.SyndicNow.model.entities.StatutHistorique;
import ma.Nabil.SyndicNow.model.entities.Commentaire;
import org.mapstruct.*;

import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {DocumentMapper.class},
        imports = {Date.class, ChronoUnit.class})
public interface ReclamationMapper {
    
    @Mapping(target = "copropriétaireId", source = "copropriétaire.id")
    @Mapping(target = "copropriétaireNom", source = "copropriétaire.nom")
    @Mapping(target = "appartementId", source = "appartement.id")
    @Mapping(target = "appartementNumero", source = "appartement.numero")
    @Mapping(target = "immeubleId", source = "appartement.immeuble.id")
    @Mapping(target = "immeubleNom", source = "appartement.immeuble.nom")
    @Mapping(target = "delaiTraitement", expression = "java(calculerDelaiTraitement(reclamation))")
    @Mapping(target = "horsDelai", expression = "java(isHorsDelai(reclamation))")
    @Mapping(target = "joursDepuisCreation", expression = "java(calculerJoursDepuisCreation(reclamation))")
    @Mapping(target = "historiqueStatuts", expression = "java(mapHistoriqueStatuts(reclamation))")
    @Mapping(target = "commentaires", expression = "java(mapCommentaires(reclamation))")
    ReclamationDTO toDto(Reclamation reclamation);
    
    List<ReclamationDTO> toDtoList(List<Reclamation> reclamations);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(reclamationCreateDTO))")
    @Mapping(target = "statut", constant = "NOUVELLE")
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "copropriétaire", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Reclamation toEntity(ReclamationCreateDTO reclamationCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateDerniereModification", expression = "java(new Date())")
    @Mapping(target = "copropriétaire", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateReclamationFromDto(ReclamationUpdateDTO reclamationUpdateDTO, @MappingTarget Reclamation reclamation);
    
    default int calculerDelaiTraitement(Reclamation reclamation) {
        if (reclamation.getDateCloture() == null) {
            return (int) ChronoUnit.DAYS.between(
                reclamation.getDateCreation().toInstant(),
                new Date().toInstant()
            );
        }
        return (int) ChronoUnit.DAYS.between(
            reclamation.getDateCreation().toInstant(),
            reclamation.getDateCloture().toInstant()
        );
    }
    
    default boolean isHorsDelai(Reclamation reclamation) {
        int delaiMaximal = switch (reclamation.getPriorite()) {
            case "HAUTE" -> 2;
            case "MOYENNE" -> 5;
            case "BASSE" -> 10;
            default -> 7;
        };
        return calculerDelaiTraitement(reclamation) > delaiMaximal;
    }
    
    default int calculerJoursDepuisCreation(Reclamation reclamation) {
        return (int) ChronoUnit.DAYS.between(
            reclamation.getDateCreation().toInstant(),
            new Date().toInstant()
        );
    }
    
    default List<ReclamationDTO.StatutHistoriqueDTO> mapHistoriqueStatuts(Reclamation reclamation) {
        if (reclamation.getHistoriqueStatuts() == null) return List.of();
        return reclamation.getHistoriqueStatuts().stream()
                .map(h -> {
                    ReclamationDTO.StatutHistoriqueDTO dto = new ReclamationDTO.StatutHistoriqueDTO();
                    dto.setStatut(h.getStatut());
                    dto.setDate(h.getDate());
                    dto.setModifiePar(h.getModifiePar());
                    dto.setCommentaire(h.getCommentaire());
                    return dto;
                })
                .sorted(Comparator.comparing(ReclamationDTO.StatutHistoriqueDTO::getDate))
                .collect(Collectors.toList());
    }
    
    default List<ReclamationDTO.CommentaireDTO> mapCommentaires(Reclamation reclamation) {
        if (reclamation.getCommentaires() == null) return List.of();
        return reclamation.getCommentaires().stream()
                .map(c -> {
                    ReclamationDTO.CommentaireDTO dto = new ReclamationDTO.CommentaireDTO();
                    dto.setId(c.getId());
                    dto.setTexte(c.getTexte());
                    dto.setDate(c.getDate());
                    dto.setAuteur(c.getAuteur());
                    dto.setInterne(c.isInterne());
                    return dto;
                })
                .sorted(Comparator.comparing(ReclamationDTO.CommentaireDTO::getDate))
                .collect(Collectors.toList());
    }
    
    default String generateReference(ReclamationCreateDTO dto) {
        return String.format("REC-%s-%d-%d",
            dto.getCategorie().substring(0, Math.min(3, dto.getCategorie().length())),
            dto.getAppartementId(),
            System.currentTimeMillis() % 10000
        ).toUpperCase();
    }
    
    @AfterMapping
    default void handleDateCloture(@MappingTarget Reclamation reclamation, ReclamationUpdateDTO dto) {
        if (dto.isCloture() && reclamation.getDateCloture() == null) {
            reclamation.setDateCloture(new Date());
        }
    }
}
