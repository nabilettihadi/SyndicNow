package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;

import java.util.List;

public interface ImmeubleService {
    ImmeubleResponse createImmeuble(ImmeubleRequest dto);

    ImmeubleResponse updateImmeuble(Long id, ImmeubleRequest dto);

    ImmeubleResponse getImmeubleById(Long id);

    List<ImmeubleResponse> getAllImmeubles();

    void deleteImmeuble(Long id);
}
