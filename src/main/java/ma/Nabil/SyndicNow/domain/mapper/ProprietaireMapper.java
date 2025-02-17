package ma.Nabil.SyndicNow.domain.mapper;

import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireUpdateDTO;
import ma.Nabil.SyndicNow.domain.entity.Proprietaire;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {AppartementMapper.class})
public interface ProprietaireMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "role", constant = "ROLE_PROPRIETAIRE")
    Proprietaire toEntity(ProprietaireCreateDTO dto);

    @Mapping(target = "appartements", ignore = true)
    void updateEntityFromDto(ProprietaireUpdateDTO dto, @MappingTarget Proprietaire proprietaire);

    ProprietaireResponseDTO toResponseDto(Proprietaire proprietaire);

    @AfterMapping
    default void setAppartements(@MappingTarget ProprietaireResponseDTO dto, Proprietaire proprietaire) {
        if (proprietaire.getAppartements() != null && !proprietaire.getAppartements().isEmpty()) {
            dto.setAppartements(AppartementMapper.INSTANCE.toResponseDtoSet(proprietaire.getAppartements()));
        }
    }
}
