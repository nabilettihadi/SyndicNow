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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proprietaires")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Owner Management", description = "APIs for managing property owners")
public class ProprietaireController {

    private final ProprietaireService proprietaireService;

    @PostMapping
    @Operation(summary = "Create a new owner",
            description = "Creates a new property owner with the provided information")
    @ApiResponse(responseCode = "201", description = "Owner successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<ProprietaireResponse> createProprietaire(@Valid @RequestBody ProprietaireRequest dto) {
        log.info("Creating new owner with data: {}", dto);
        ProprietaireResponse response = proprietaireService.createProprietaire(dto);
        log.info("Successfully created owner with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing owner",
            description = "Updates a property owner's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Owner successfully updated")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<ProprietaireResponse> updateProprietaire(
            @Parameter(description = "ID of the owner to update") @PathVariable Long id,
            @Valid @RequestBody ProprietaireRequest dto) {
        log.info("Updating owner with ID: {} with data: {}", id, dto);
        ProprietaireResponse response = proprietaireService.updateProprietaire(id, dto);
        log.info("Successfully updated owner with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an owner by ID",
            description = "Retrieves a property owner's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Owner found and returned")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<ProprietaireResponse> getProprietaireById(
            @Parameter(description = "ID of the owner to retrieve") @PathVariable Long id) {
        log.debug("Fetching owner with ID: {}", id);
        ProprietaireResponse response = proprietaireService.getProprietaireById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all owners",
            description = "Retrieves a list of all property owners in the system")
    @ApiResponse(responseCode = "200", description = "List of owners retrieved successfully")
    public ResponseEntity<List<ProprietaireResponse>> getAllProprietaires() {
        log.debug("Fetching all owners");
        List<ProprietaireResponse> response = proprietaireService.getAllProprietaires();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an owner",
            description = "Deletes a property owner based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Owner successfully deleted")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<Void> deleteProprietaire(
            @Parameter(description = "ID of the owner to delete") @PathVariable Long id) {
        log.info("Deleting owner with ID: {}", id);
        proprietaireService.deleteProprietaire(id);
        log.info("Successfully deleted owner with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
