package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.entity.Document;

import java.util.List;

public interface DocumentService {
    Document createDocument(Document document);

    Document getDocumentById(Long id);

    Document updateDocument(Long id, Document document);

    void deleteDocument(Long id);

    List<Document> listDocuments();

    List<Document> getDocumentsByProprietaire(Long proprietaireId);

    List<Document> getDocumentsBySyndic(Long syndicId);
}
