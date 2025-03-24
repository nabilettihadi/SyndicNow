package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.appartement.AppartementRequest;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponse;
import ma.Nabil.SyndicNow.service.AppartementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appartements")
@RequiredArgsConstructor
@Validated
@Tag(name = "Appartement Management", description = "APIs for managing apartments")
@PreAuthorize("isAuthenticated()")
public class AppartementController {
    private static final Logger log = LoggerFactory.getLogger(AppartementController.class);
    private final AppartementService appartementService;

    @PostMapping
    @Operation(summary = "Create a new apartment", description = "Creates a new apartment with the provided information")
    @ApiResponse(responseCode = "201", description = "Apartment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppartementResponse> createAppartement(@Valid @RequestBody AppartementRequest dto) {
        log.info("Creating new apartment with data: {}", dto);
        AppartementResponse response = appartementService.createAppartement(dto);
        log.info("Successfully created apartment with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing apartment", description = "Updates an apartment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Apartment successfully updated")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppartementResponse> updateAppartement(@Parameter(description = "ID of the apartment to update") @PathVariable Long id, @Valid @RequestBody AppartementRequest dto) {
        log.info("Updating apartment with ID: {} with data: {}", id, dto);
        AppartementResponse response = appartementService.updateAppartement(id, dto);
        log.info("Successfully updated apartment with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an apartment by ID", description = "Retrieves an apartment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Apartment found and returned")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<AppartementResponse> getAppartementById(@Parameter(description = "ID of the apartment to retrieve") @PathVariable Long id) {
        log.debug("Fetching apartment with ID: {}", id);
        AppartementResponse response = appartementService.getAppartementById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all apartments", description = "Retrieves a paginated list of all apartments in the system")
    @ApiResponse(responseCode = "200", description = "List of apartments retrieved successfully")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<AppartementResponse>> getAllAppartements(Pageable pageable) {
        log.debug("Fetching all apartments with pagination: {}", pageable);
        Page<AppartementResponse> response = appartementService.getAllAppartements(pageable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an apartment", description = "Deletes an apartment based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Apartment successfully deleted")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppartement(@Parameter(description = "ID of the apartment to delete") @PathVariable Long id) {
        log.info("Deleting apartment with ID: {}", id);
        appartementService.deleteAppartement(id);
        log.info("Successfully deleted apartment with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/proprietaire/{proprietaireId}")
    @Operation(summary = "Get apartments by proprietaire", description = "Retrieves a list of apartments for a specific proprietaire")
    @ApiResponse(responseCode = "200", description = "List of apartments retrieved successfully")
    @PreAuthorize("hasAnyRole('PROPRIETAIRE', 'ADMIN')")
    public ResponseEntity<List<AppartementResponse>> getAppartementsByProprietaire(@PathVariable Long proprietaireId) {
        log.debug("Fetching apartments for proprietaire with ID: {}", proprietaireId);
        List<AppartementResponse> response = appartementService.getAppartementsByProprietaire(proprietaireId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/proprietaire/{proprietaireId}")
    @Operation(summary = "Create a new apartment for a proprietaire", description = "Creates a new apartment and associates it with the specified proprietaire")
    @ApiResponse(responseCode = "201", description = "Apartment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @PreAuthorize("hasRole('PROPRIETAIRE')")
    public ResponseEntity<AppartementResponse> createAppartementForProprietaire(@PathVariable Long proprietaireId, @Valid @RequestBody AppartementRequest dto) {
        log.info("Creating new apartment for proprietaire {} with data: {}", proprietaireId, dto);
        AppartementResponse response = appartementService.createAppartementForProprietaire(proprietaireId, dto);
        log.info("Successfully created apartment with ID: {} for proprietaire: {}", response.getId(), proprietaireId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/immeuble/{immeubleId}")
    @Operation(summary = "Get apartments by building", description = "Retrieves a list of apartments in a specific building")
    @ApiResponse(responseCode = "200", description = "List of apartments retrieved successfully")
    @PreAuthorize("hasAnyRole('SYNDIC', 'ADMIN', 'PROPRIETAIRE')")
    public ResponseEntity<List<AppartementResponse>> getAppartementsByImmeuble(@PathVariable Long immeubleId) {
        log.debug("Fetching apartments for building with ID: {}", immeubleId);
        List<AppartementResponse> response = appartementService.getAppartementsByImmeuble(immeubleId);
        return ResponseEntity.ok(response);
    }
}
