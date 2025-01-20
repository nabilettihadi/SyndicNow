package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleCreateDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ImmeubleService {
    ImmeubleDTO createImmeuble(ImmeubleCreateDTO createDTO);
    ImmeubleDTO updateImmeuble(Long id, ImmeubleUpdateDTO updateDTO);
    ImmeubleDTO getImmeubleById(Long id);
    Page<ImmeubleDTO> getAllImmeubles(Pageable pageable);
    Page<ImmeubleDTO> getImmeublesBySyndic(Long syndicId, Pageable pageable);
    void deleteImmeuble(Long id);
    boolean existsById(Long id);
}
