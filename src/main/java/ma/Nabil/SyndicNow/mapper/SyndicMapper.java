package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.syndic.SyndicCreateDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponseDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicUpdateDTO;
import ma.Nabil.SyndicNow.entity.Syndic;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        uses = {ImmeubleMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SyndicMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "immeubles", ignore = true)
    @Mapping(target = "accountNonExpired", constant = "true")
    @Mapping(target = "accountNonLocked", constant = "true")
    @Mapping(target = "credentialsNonExpired", constant = "true")
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "dateDebutActivite", expression = "java(java.time.LocalDateTime.now())")
    Syndic toEntity(SyndicCreateDTO dto);

    @Mapping(target = "immeubles", ignore = true)
    void updateEntityFromDto(SyndicUpdateDTO dto, @MappingTarget Syndic syndic);

    SyndicResponseDTO toResponseDto(Syndic syndic);

    @AfterMapping
    default void setImmeubles(@MappingTarget SyndicResponseDTO dto, Syndic syndic) {
        if (syndic.getImmeubles() != null && !syndic.getImmeubles().isEmpty()) {
            dto.setImmeubles(ImmeubleMapper.INSTANCE.toResponseDtoSet(syndic.getImmeubles()));
        }
    }
}
