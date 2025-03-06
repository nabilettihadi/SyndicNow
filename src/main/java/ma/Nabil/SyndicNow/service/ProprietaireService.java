package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;

import java.util.List;

public interface ProprietaireService {
    ProprietaireResponse createProprietaire(ProprietaireRequest dto);

    ProprietaireResponse updateProprietaire(Long id, ProprietaireRequest dto);

    ProprietaireResponse getProprietaireById(Long id);

    List<ProprietaireResponse> getAllProprietaires();

    void deleteProprietaire(Long id);
}
