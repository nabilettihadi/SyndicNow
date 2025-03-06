package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.enums.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, imports = {Role.class})
@Component
public interface ProprietaireMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "role", constant = "PROPRIETAIRE")
    Proprietaire toEntity(ProprietaireRequest request);

    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "cin", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntityFromDto(ProprietaireRequest request, @MappingTarget Proprietaire proprietaire);

    @Mapping(target = "immeubleId", ignore = true)
    @Mapping(target = "immeubleName", ignore = true)
    @Mapping(target = "appartementId", ignore = true)
    @Mapping(target = "appartementNumero", ignore = true)
    ProprietaireResponse toResponse(Proprietaire proprietaire);
}
