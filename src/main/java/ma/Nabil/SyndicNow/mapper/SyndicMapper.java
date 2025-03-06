package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, imports = {Role.class})
@Component
public interface SyndicMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "immeubles", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "role", constant = "SYNDIC")
    @Mapping(target = "cin", source = "cin")
    @Mapping(target = "siret", source = "siret")
    @Mapping(target = "societe", source = "societe")
    @Mapping(target = "entreprise", source = "societe")
    @Mapping(target = "dateDebutActivite", source = "dateDebutActivite")
    Syndic toEntity(SyndicRequest request);

    @Mapping(target = "immeubles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "cin", source = "cin")
    @Mapping(target = "siret", source = "siret")
    @Mapping(target = "societe", source = "societe")
    @Mapping(target = "entreprise", source = "societe")
    @Mapping(target = "dateDebutActivite", source = "dateDebutActivite")
    void updateEntityFromDto(SyndicRequest request, @MappingTarget Syndic syndic);

    @Mapping(target = "immeubleIds", expression = "java(syndic.getImmeubles() != null ? syndic.getImmeubles().stream().map(immeuble -> immeuble.getId()).collect(java.util.stream.Collectors.toList()) : java.util.Collections.emptyList())")
    SyndicResponse toResponse(Syndic syndic);
}
