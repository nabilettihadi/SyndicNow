package ma.Nabil.SyndicNow.controller;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.entity.Document;
import ma.Nabil.SyndicNow.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<Document> createDocument(@RequestBody Document document) {
        Document createdDocument = documentService.createDocument(document);
        return ResponseEntity.ok(createdDocument);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/proprietaire/{proprietaireId}")
    public ResponseEntity<List<Document>> getDocumentsByProprietaire(@PathVariable Long proprietaireId) {
        List<Document> documents = documentService.getDocumentsByProprietaire(proprietaireId);
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @RequestBody Document document) {
        Document updatedDocument = documentService.updateDocument(id, document);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Document>> listDocuments() {
        List<Document> documents = documentService.listDocuments();
        return ResponseEntity.ok(documents);
    }
}
