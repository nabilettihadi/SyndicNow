package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.immeuble.ImmeubleCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.immeuble.ImmeubleResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.immeuble.ImmeubleUpdateDTO;

import java.util.List;

public interface ImmeubleService {
    ImmeubleResponseDTO createImmeuble(ImmeubleCreateDTO dto);

    ImmeubleResponseDTO updateImmeuble(Long id, ImmeubleUpdateDTO dto);

    ImmeubleResponseDTO getImmeubleById(Long id);

    List<ImmeubleResponseDTO> getAllImmeubles();

    void deleteImmeuble(Long id);
}
