package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.service.ProprietaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proprietaires")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Proprietaire Management", description = "APIs for managing proprietaires")
public class ProprietaireController {

    private final ProprietaireService proprietaireService;

    @PostMapping
    @Operation(summary = "Create a new proprietaire", description = "Creates a new proprietaire with the provided information")
    @ApiResponse(responseCode = "201", description = "Proprietaire successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<ProprietaireResponse> createProprietaire(@Valid @RequestBody ProprietaireRequest dto) {
        log.info("Creating new proprietaire with data: {}", dto);
        ProprietaireResponse response = proprietaireService.createProprietaire(dto);
        log.info("Successfully created proprietaire with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing proprietaire", description = "Updates a proprietaire's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Proprietaire successfully updated")
    @ApiResponse(responseCode = "404", description = "Proprietaire not found")
    public ResponseEntity<ProprietaireResponse> updateProprietaire(@Parameter(description = "ID of the proprietaire to update") @PathVariable Long id, @Valid @RequestBody ProprietaireRequest dto) {
        log.info("Updating proprietaire with ID: {} with data: {}", id, dto);
        ProprietaireResponse response = proprietaireService.updateProprietaire(id, dto);
        log.info("Successfully updated proprietaire with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a proprietaire by ID", description = "Retrieves a proprietaire's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Proprietaire found and returned")
    @ApiResponse(responseCode = "404", description = "Proprietaire not found")
    public ResponseEntity<ProprietaireResponse> getProprietaireById(@Parameter(description = "ID of the proprietaire to retrieve") @PathVariable Long id) {
        log.debug("Fetching proprietaire with ID: {}", id);
        ProprietaireResponse response = proprietaireService.getProprietaireById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all proprietaires", description = "Retrieves a list of all proprietaires in the system")
    @ApiResponse(responseCode = "200", description = "List of proprietaires retrieved successfully")
    public ResponseEntity<List<ProprietaireResponse>> getAllProprietaires() {
        log.debug("Fetching all proprietaires");
        List<ProprietaireResponse> response = proprietaireService.getAllProprietaires();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a proprietaire", description = "Deletes a proprietaire based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Proprietaire successfully deleted")
    @ApiResponse(responseCode = "404", description = "Proprietaire not found")
    public ResponseEntity<Void> deleteProprietaire(@Parameter(description = "ID of the proprietaire to delete") @PathVariable Long id) {
        log.info("Deleting proprietaire with ID: {}", id);
        proprietaireService.deleteProprietaire(id);
        log.info("Successfully deleted proprietaire with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile")
    @Operation(summary = "Update the current proprietaire's profile", description = "Allows a proprietaire to update their personal information")
    @ApiResponse(responseCode = "200", description = "Profile successfully updated")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @ApiResponse(responseCode = "404", description = "Proprietaire not found")
    @PreAuthorize("hasRole('PROPRIETAIRE')")
    public ResponseEntity<ProprietaireResponse> updateProfile(@Valid @RequestBody ProprietaireRequest dto) {
        log.info("Updating current proprietaire profile");
        ProprietaireResponse response = proprietaireService.updateProfile(dto);
        log.info("Successfully updated proprietaire profile");
        return ResponseEntity.ok(response);
    }
}
