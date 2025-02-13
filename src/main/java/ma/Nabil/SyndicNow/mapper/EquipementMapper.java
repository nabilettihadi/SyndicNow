package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.equipement.EquipementDTO;
import ma.Nabil.SyndicNow.dto.equipement.EquipementCreateDTO;
import ma.Nabil.SyndicNow.dto.equipement.EquipementUpdateDTO;
import ma.Nabil.SyndicNow.model.entities.Equipement;
import ma.Nabil.SyndicNow.model.entities.Intervention;
import org.mapstruct.*;

import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {DocumentMapper.class},
        imports = {Date.class, ChronoUnit.class})
public interface EquipementMapper {
    
    @Mapping(target = "immeubleId", source = "immeuble.id")
    @Mapping(target = "immeubleNom", source = "immeuble.nom")
    @Mapping(target = "fournisseurNom", source = "fournisseur.nom")
    @Mapping(target = "sousGarantie", expression = "java(isSousGarantie(equipement))")
    @Mapping(target = "nombrePannes", expression = "java(calculerNombrePannes(equipement))")
    @Mapping(target = "nombreInterventions", expression = "java(equipement.getInterventions().size())")
    @Mapping(target = "dernierIncident", expression = "java(getDernierIncident(equipement))")
    @Mapping(target = "coutTotalMaintenance", expression = "java(calculerCoutTotalMaintenance(equipement))")
    @Mapping(target = "dernieresInterventions", expression = "java(mapDernieresInterventions(equipement))")
    EquipementDTO toDto(Equipement equipement);
    
    List<EquipementDTO> toDtoList(List<Equipement> equipements);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(equipementCreateDTO))")
    @Mapping(target = "interventions", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "fournisseur", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Equipement toEntity(EquipementCreateDTO equipementCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "interventions", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "fournisseur", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateEquipementFromDto(EquipementUpdateDTO equipementUpdateDTO, @MappingTarget Equipement equipement);
    
    default boolean isSousGarantie(Equipement equipement) {
        if (equipement.getDateFinGarantie() == null) {
            return false;
        }
        return equipement.getDateFinGarantie().after(new Date());
    }
    
    default int calculerNombrePannes(Equipement equipement) {
        if (equipement.getInterventions() == null) return 0;
        return (int) equipement.getInterventions().stream()
                .filter(i -> i.getType().name().contains("PANNE"))
                .count();
    }
    
    default Date getDernierIncident(Equipement equipement) {
        if (equipement.getInterventions() == null || equipement.getInterventions().isEmpty()) {
            return null;
        }
        return equipement.getInterventions().stream()
                .map(Intervention::getDateIntervention)
                .max(Date::compareTo)
                .orElse(null);
    }
    
    default double calculerCoutTotalMaintenance(Equipement equipement) {
        if (equipement.getInterventions() == null) return 0.0;
        return equipement.getInterventions().stream()
                .mapToDouble(Intervention::getCout)
                .sum();
    }
    
    default List<EquipementDTO.InterventionSimpleDTO> mapDernieresInterventions(Equipement equipement) {
        if (equipement.getInterventions() == null) return List.of();
        return equipement.getInterventions().stream()
                .sorted(Comparator.comparing(Intervention::getDateIntervention).reversed())
                .limit(5)
                .map(i -> {
                    EquipementDTO.InterventionSimpleDTO dto = new EquipementDTO.InterventionSimpleDTO();
                    dto.setId(i.getId());
                    dto.setDateIntervention(i.getDateIntervention());
                    dto.setType(i.getType().name());
                    dto.setDescription(i.getDescription());
                    dto.setCout(i.getCout());
                    dto.setTechnicien(i.getTechnicien());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    default String generateReference(EquipementCreateDTO dto) {
        return String.format("EQP-%s-%s-%d",
            dto.getType().name().substring(0, 3),
            dto.getMarque().substring(0, Math.min(3, dto.getMarque().length())),
            System.currentTimeMillis() % 10000
        ).toUpperCase();
    }
}
