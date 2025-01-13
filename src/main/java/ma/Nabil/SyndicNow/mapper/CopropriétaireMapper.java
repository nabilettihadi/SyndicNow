package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.CopropriétaireDTO;
import ma.Nabil.SyndicNow.dto.CopropriétaireCreateDTO;
import ma.Nabil.SyndicNow.dto.CopropriétaireUpdateDTO;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import org.mapstruct.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CopropriétaireMapper {
    
    @Mapping(target = "appartements", expression = "java(mapAppartements(copropriétaire))")
    @Mapping(target = "totalQuotePart", expression = "java(calculerTotalQuotePart(copropriétaire))")
    @Mapping(target = "totalCotisations", expression = "java(calculerTotalCotisations(copropriétaire))")
    @Mapping(target = "cotisationsImpayees", expression = "java(calculerCotisationsImpayees(copropriétaire))")
    @Mapping(target = "aJour", expression = "java(estAJour(copropriétaire))")
    @Mapping(target = "dernierPaiement", expression = "java(getDernierPaiement(copropriétaire))")
    @Mapping(target = "solde", expression = "java(calculerSolde(copropriétaire))")
    @Mapping(target = "nombreAppartements", expression = "java(copropriétaire.getAppartements().size())")
    @Mapping(target = "nombreIncidents", expression = "java(calculerNombreIncidents(copropriétaire))")
    @Mapping(target = "nombreReclamations", expression = "java(calculerNombreReclamations(copropriétaire))")
    CopropriétaireDTO toDto(Copropriétaire copropriétaire);
    
    List<CopropriétaireDTO> toDtoList(List<Copropriétaire> copropriétaires);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAjout", expression = "java(new java.util.Date())")
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "actif", constant = "true")
    Copropriétaire toEntity(CopropriétaireCreateDTO createDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appartements", ignore = true)
    void updateCopropriétaireFromDto(CopropriétaireUpdateDTO updateDTO, @MappingTarget Copropriétaire copropriétaire);
    
    default List<CopropriétaireDTO.AppartementSimpleDTO> mapAppartements(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return List.of();
        return copropriétaire.getAppartements().stream()
                .map(app -> {
                    CopropriétaireDTO.AppartementSimpleDTO dto = new CopropriétaireDTO.AppartementSimpleDTO();
                    dto.setId(app.getId());
                    dto.setNumero(app.getNumero());
                    dto.setImmeuble(app.getImmeuble().getNom());
                    dto.setQuotePart(app.getQuotePart());
                    dto.setAJour(estAppartementAJour(app));
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    default double calculerTotalQuotePart(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0.0;
        return copropriétaire.getAppartements().stream()
                .mapToDouble(Appartement::getQuotePart)
                .sum();
    }
    
    default double calculerTotalCotisations(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0.0;
        return copropriétaire.getAppartements().stream()
                .flatMap(app -> app.getTransactions().stream())
                .filter(t -> t.getType() == TypeTransaction.COTISATION)
                .mapToDouble(Transaction::getMontant)
                .sum();
    }
    
    default double calculerCotisationsImpayees(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0.0;
        return copropriétaire.getAppartements().stream()
                .flatMap(app -> app.getTransactions().stream())
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.EN_ATTENTE)
                .mapToDouble(Transaction::getMontant)
                .sum();
    }
    
    default boolean estAJour(Copropriétaire copropriétaire) {
        return calculerCotisationsImpayees(copropriétaire) == 0.0;
    }
    
    default boolean estAppartementAJour(Appartement appartement) {
        return appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.EN_ATTENTE)
                .mapToDouble(Transaction::getMontant)
                .sum() == 0.0;
    }
    
    default Date getDernierPaiement(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return null;
        return copropriétaire.getAppartements().stream()
                .flatMap(app -> app.getTransactions().stream())
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.PAYEE)
                .max(Comparator.comparing(Transaction::getDateTransaction))
                .map(Transaction::getDateTransaction)
                .orElse(null);
    }
    
    default double calculerSolde(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0.0;
        double totalCotisations = calculerTotalCotisations(copropriétaire);
        double totalPaye = copropriétaire.getAppartements().stream()
                .flatMap(app -> app.getTransactions().stream())
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.PAYEE)
                .mapToDouble(Transaction::getMontant)
                .sum();
        return totalPaye - totalCotisations;
    }
    
    default int calculerNombreIncidents(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0;
        return copropriétaire.getAppartements().stream()
                .mapToInt(app -> app.getIncidents().size())
                .sum();
    }
    
    default int calculerNombreReclamations(Copropriétaire copropriétaire) {
        if (copropriétaire.getAppartements() == null) return 0;
        return copropriétaire.getAppartements().stream()
                .mapToInt(app -> app.getReclamations().size())
                .sum();
    }
}
