package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.transaction.TransactionCreateDTO;
import ma.Nabil.SyndicNow.dto.transaction.TransactionDTO;
import ma.Nabil.SyndicNow.dto.transaction.TransactionUpdateDTO;
import ma.Nabil.SyndicNow.mapper.TransactionMapper;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.repository.TransactionRepository;
import ma.Nabil.SyndicNow.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    @Override
    public TransactionDTO createTransaction(TransactionCreateDTO createDTO) {
        Transaction transaction = transactionMapper.toEntity(createDTO);
        transaction = transactionRepository.save(transaction);
        return transactionMapper.toDto(transaction);
    }

    @Override
    public TransactionDTO updateTransaction(Long id, TransactionUpdateDTO updateDTO) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with id: " + id));
        
        transactionMapper.updateEntity(updateDTO, existingTransaction);
        existingTransaction = transactionRepository.save(existingTransaction);
        return transactionMapper.toDto(existingTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionDTO getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .map(transactionMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionDTO> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable)
                .map(transactionMapper::toDto);
    }

    @Override
    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return transactionRepository.existsById(id);
    }
}
