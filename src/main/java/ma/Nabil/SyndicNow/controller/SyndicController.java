package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.service.SyndicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/syndics")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Syndic Management", description = "APIs for managing syndics")
public class SyndicController {

    private final SyndicService syndicService;

    @PostMapping
    @Operation(summary = "Create a new syndic", description = "Creates a new syndic with the provided information")
    @ApiResponse(responseCode = "201", description = "Syndic successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<SyndicResponse> createSyndic(@Valid @RequestBody SyndicRequest dto) {
        log.info("Creating new syndic with data: {}", dto);
        SyndicResponse response = syndicService.createSyndic(dto);
        log.info("Successfully created syndic with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing syndic", description = "Updates a syndic's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Syndic successfully updated")
    @ApiResponse(responseCode = "404", description = "Syndic not found")
    public ResponseEntity<SyndicResponse> updateSyndic(@Parameter(description = "ID of the syndic to update") @PathVariable Long id, @Valid @RequestBody SyndicRequest dto) {
        log.info("Updating syndic with ID: {} with data: {}", id, dto);
        SyndicResponse response = syndicService.updateSyndic(id, dto);
        log.info("Successfully updated syndic with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a syndic by ID", description = "Retrieves a syndic's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Syndic found and returned")
    @ApiResponse(responseCode = "404", description = "Syndic not found")
    public ResponseEntity<SyndicResponse> getSyndicById(@Parameter(description = "ID of the syndic to retrieve") @PathVariable Long id) {
        log.debug("Fetching syndic with ID: {}", id);
        SyndicResponse response = syndicService.getSyndicById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all syndics", description = "Retrieves a list of all syndics in the system")
    @ApiResponse(responseCode = "200", description = "List of syndics retrieved successfully")
    public ResponseEntity<List<SyndicResponse>> getAllSyndics() {
        log.debug("Fetching all syndics");
        List<SyndicResponse> response = syndicService.getAllSyndics();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a syndic", description = "Deletes a syndic based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Syndic successfully deleted")
    @ApiResponse(responseCode = "404", description = "Syndic not found")
    public ResponseEntity<Void> deleteSyndic(@Parameter(description = "ID of the syndic to delete") @PathVariable Long id) {
        log.info("Deleting syndic with ID: {}", id);
        syndicService.deleteSyndic(id);
        log.info("Successfully deleted syndic with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
