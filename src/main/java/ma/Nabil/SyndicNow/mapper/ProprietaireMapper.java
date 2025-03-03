package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireCreateDTO;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponseDTO;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireUpdateDTO;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import org.mapstruct.*;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        uses = {AppartementMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProprietaireMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    Proprietaire toEntity(ProprietaireCreateDTO dto);

    @Mapping(target = "appartements", ignore = true)
    void updateEntityFromDto(ProprietaireUpdateDTO dto, @MappingTarget Proprietaire proprietaire);

    @Mapping(target = "appartements", ignore = true)
    ProprietaireResponseDTO toResponseDto(Proprietaire proprietaire);

    @AfterMapping
    default void setAppartements(@MappingTarget ProprietaireResponseDTO dto, Proprietaire proprietaire, @Context AppartementMapper appartementMapper) {
        if (proprietaire.getAppartements() != null && !proprietaire.getAppartements().isEmpty()) {
            dto.setAppartements(proprietaire.getAppartements().stream()
                    .map(appartementMapper::toResponseDto)
                    .collect(Collectors.toSet()));
        }
    }
}
