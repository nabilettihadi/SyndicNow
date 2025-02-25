package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.entity.Document;

import java.util.List;

public interface DocumentService {
    Document createDocument(Document document);

    Document getDocumentById(Long id);

    Document updateDocument(Long id, Document document);

    void deleteDocument(Long id);

    List<Document> listDocuments();
}
