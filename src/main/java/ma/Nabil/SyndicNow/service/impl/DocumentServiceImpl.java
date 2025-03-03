package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.entity.Document;
import ma.Nabil.SyndicNow.repository.DocumentRepository;
import ma.Nabil.SyndicNow.service.DocumentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @Override
    @Transactional
    public Document updateDocument(Long id, Document document) {
        Document existingDocument = getDocumentById(id);
        existingDocument.setNom(document.getNom());
        existingDocument.setType(document.getType());
        existingDocument.setCategory(document.getCategory());
        existingDocument.setFilePath(document.getFilePath());
        existingDocument.setFileSize(document.getFileSize());
        existingDocument.setUploadedBy(document.getUploadedBy());
        existingDocument.setVisibility(document.getVisibility());
        existingDocument.setExpiryDate(document.getExpiryDate());
        existingDocument.setDocumentVersion(document.getDocumentVersion());
        existingDocument.setDescription(document.getDescription());
        existingDocument.setImmeuble(document.getImmeuble());
        return documentRepository.save(existingDocument);
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    @Override
    public List<Document> listDocuments() {
        return documentRepository.findAll();
    }
}
