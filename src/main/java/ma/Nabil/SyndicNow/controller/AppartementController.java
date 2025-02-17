package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementUpdateDTO;
import ma.Nabil.SyndicNow.service.AppartementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appartements")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Appartement Management", description = "APIs for managing apartments")
public class AppartementController {

    private final AppartementService appartementService;

    @PostMapping
    @Operation(summary = "Create a new apartment",
            description = "Creates a new apartment with the provided information")
    @ApiResponse(responseCode = "201", description = "Apartment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<AppartementResponseDTO> createAppartement(@Valid @RequestBody AppartementCreateDTO dto) {
        log.info("Creating new apartment with data: {}", dto);
        AppartementResponseDTO response = appartementService.createAppartement(dto);
        log.info("Successfully created apartment with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing apartment",
            description = "Updates an apartment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Apartment successfully updated")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    public ResponseEntity<AppartementResponseDTO> updateAppartement(
            @Parameter(description = "ID of the apartment to update") @PathVariable Long id,
            @Valid @RequestBody AppartementUpdateDTO dto) {
        log.info("Updating apartment with ID: {} with data: {}", id, dto);
        AppartementResponseDTO response = appartementService.updateAppartement(id, dto);
        log.info("Successfully updated apartment with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an apartment by ID",
            description = "Retrieves an apartment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Apartment found and returned")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    public ResponseEntity<AppartementResponseDTO> getAppartementById(
            @Parameter(description = "ID of the apartment to retrieve") @PathVariable Long id) {
        log.debug("Fetching apartment with ID: {}", id);
        AppartementResponseDTO response = appartementService.getAppartementById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all apartments",
            description = "Retrieves a list of all apartments in the system")
    @ApiResponse(responseCode = "200", description = "List of apartments retrieved successfully")
    public ResponseEntity<List<AppartementResponseDTO>> getAllAppartements() {
        log.debug("Fetching all apartments");
        List<AppartementResponseDTO> response = appartementService.getAllAppartements();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an apartment",
            description = "Deletes an apartment based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Apartment successfully deleted")
    @ApiResponse(responseCode = "404", description = "Apartment not found")
    public ResponseEntity<Void> deleteAppartement(
            @Parameter(description = "ID of the apartment to delete") @PathVariable Long id) {
        log.info("Deleting apartment with ID: {}", id);
        appartementService.deleteAppartement(id);
        log.info("Successfully deleted apartment with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
