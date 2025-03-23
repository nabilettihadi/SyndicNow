package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;

import java.util.List;

public interface SyndicService {
    SyndicResponse createSyndic(SyndicRequest request);

    SyndicResponse updateSyndic(Long id, SyndicRequest request);

    SyndicResponse getSyndicById(Long id);

    List<SyndicResponse> getAllSyndics();

    void deleteSyndic(Long id);

    /**
     * Met à jour le profil du syndic actuellement connecté
     * @param dto Les données de mise à jour du profil
     * @return Les informations du syndic mises à jour
     */
    SyndicResponse updateProfile(SyndicRequest dto);
}
