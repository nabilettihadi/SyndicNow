package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.SyndicDTO;
import ma.Nabil.SyndicNow.dto.SyndicCreateDTO;
import ma.Nabil.SyndicNow.dto.SyndicUpdateDTO;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SyndicMapper {
    
    @Mapping(target = "nombreImmeubles", expression = "java(syndic.getImmeubles() != null ? syndic.getImmeubles().size() : 0)")
    SyndicDTO toDto(Syndic syndic);
    
    List<SyndicDTO> toDtoList(List<Syndic> syndics);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", expression = "java(new java.util.Date())")
    @Mapping(target = "statut", constant = "ACTIF")
    @Mapping(target = "immeubles", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Syndic toEntity(SyndicCreateDTO syndicCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "immeubles", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateSyndicFromDto(SyndicUpdateDTO syndicUpdateDTO, @MappingTarget Syndic syndic);
}
