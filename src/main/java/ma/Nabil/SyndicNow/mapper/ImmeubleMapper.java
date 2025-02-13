package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleCreateDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleUpdateDTO;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {SyndicMapper.class})
public interface ImmeubleMapper {
    
    @Mapping(target = "syndicId", source = "syndic.id")
    @Mapping(target = "syndicNom", source = "syndic.nom")
    @Mapping(target = "nombreCopropriétaires", expression = "java(immeuble.getNombreCopropriétaires())")
    @Mapping(target = "surfaceCommune", expression = "java(immeuble.getSurfaceCommune())")
    @Mapping(target = "assuranceValide", expression = "java(immeuble.isAssuranceValide())")
    @Mapping(target = "nombreIncidents", expression = "java(immeuble.getAppartements().stream().mapToInt(a -> a.getIncidents().size()).sum())")
    @Mapping(target = "budgetAnnuel", expression = "java(getBudgetAnnuel(immeuble))")
    @Mapping(target = "totalCotisations", expression = "java(getTotalTransactions(immeuble, \"COTISATION\"))")
    @Mapping(target = "totalDepenses", expression = "java(getTotalTransactions(immeuble, \"DEPENSE\"))")
    ImmeubleDTO toDto(Immeuble immeuble);
    
    List<ImmeubleDTO> toDtoList(List<Immeuble> immeubles);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAjout", expression = "java(new java.util.Date())")
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "assemblees", ignore = true)
    @Mapping(target = "documents", ignore = true)
    Immeuble toEntity(ImmeubleCreateDTO immeubleCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "assemblees", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateImmeubleFromDto(ImmeubleUpdateDTO immeubleUpdateDTO, @MappingTarget Immeuble immeuble);
    
    default double getBudgetAnnuel(Immeuble immeuble) {
        if (immeuble.getBudgets() == null || immeuble.getBudgets().isEmpty()) {
            return 0.0;
        }
        return immeuble.getBudgets().stream()
                .filter(b -> b.getAnnee() == java.time.Year.now().getValue())
                .findFirst()
                .map(b -> b.getMontantPrevisionnel())
                .orElse(0.0);
    }
    
    default double getTotalTransactions(Immeuble immeuble, String type) {
        if (immeuble.getAppartements() == null) return 0.0;
        return immeuble.getAppartements().stream()
                .flatMap(a -> a.getTransactions().stream())
                .filter(t -> t.getType().name().equals(type))
                .mapToDouble(Transaction::getMontant)
                .sum();
    }
}
