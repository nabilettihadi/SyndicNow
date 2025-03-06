package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.service.ImmeubleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/immeubles")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Building Management", description = "APIs for managing buildings")
public class ImmeubleController {

    private final ImmeubleService immeubleService;

    @PostMapping
    @Operation(summary = "Create a new building",
            description = "Creates a new building with the provided information")
    @ApiResponse(responseCode = "201", description = "Building successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<ImmeubleResponse> createImmeuble(@Valid @RequestBody ImmeubleRequest dto) {
        log.info("Creating new building with data: {}", dto);
        ImmeubleResponse response = immeubleService.createImmeuble(dto);
        log.info("Successfully created building with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing building",
            description = "Updates a building's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Building successfully updated")
    @ApiResponse(responseCode = "404", description = "Building not found")
    public ResponseEntity<ImmeubleResponse> updateImmeuble(
            @Parameter(description = "ID of the building to update") @PathVariable Long id,
            @Valid @RequestBody ImmeubleRequest dto) {
        log.info("Updating building with ID: {} with data: {}", id, dto);
        ImmeubleResponse response = immeubleService.updateImmeuble(id, dto);
        log.info("Successfully updated building with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a building by ID",
            description = "Retrieves a building's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Building found and returned")
    @ApiResponse(responseCode = "404", description = "Building not found")
    public ResponseEntity<ImmeubleResponse> getImmeubleById(
            @Parameter(description = "ID of the building to retrieve") @PathVariable Long id) {
        log.debug("Fetching building with ID: {}", id);
        ImmeubleResponse response = immeubleService.getImmeubleById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all buildings",
            description = "Retrieves a list of all buildings in the system")
    @ApiResponse(responseCode = "200", description = "List of buildings retrieved successfully")
    public ResponseEntity<List<ImmeubleResponse>> getAllImmeubles() {
        log.debug("Fetching all buildings");
        List<ImmeubleResponse> response = immeubleService.getAllImmeubles();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a building",
            description = "Deletes a building based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Building successfully deleted")
    @ApiResponse(responseCode = "404", description = "Building not found")
    public ResponseEntity<Void> deleteImmeuble(
            @Parameter(description = "ID of the building to delete") @PathVariable Long id) {
        log.info("Deleting building with ID: {}", id);
        immeubleService.deleteImmeuble(id);
        log.info("Successfully deleted building with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
