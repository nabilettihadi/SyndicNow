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

    SyndicResponse updateProfile(SyndicRequest dto);
}
