package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleStatistics;

import java.util.List;

public interface ImmeubleService {
    List<ImmeubleResponse> getAllImmeubles();

    ImmeubleResponse getImmeubleById(Long id);

    List<ImmeubleResponse> getImmeublesBySyndic(Long syndicId);

    ImmeubleResponse createImmeuble(ImmeubleRequest request);

    ImmeubleResponse updateImmeuble(Long id, ImmeubleRequest request);

    void deleteImmeuble(Long id);

    ImmeubleStatistics getImmeubleStatistics();
}
