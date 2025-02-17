package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementUpdateDTO;
import ma.Nabil.SyndicNow.service.PaiementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Payment Management", description = "APIs for managing payments")
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping
    @Operation(summary = "Create a new payment",
            description = "Creates a new payment with the provided information")
    @ApiResponse(responseCode = "201", description = "Payment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<PaiementResponseDTO> createPaiement(@Valid @RequestBody PaiementCreateDTO dto) {
        log.info("Creating new payment with data: {}", dto);
        PaiementResponseDTO response = paiementService.createPaiement(dto);
        log.info("Successfully created payment with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing payment",
            description = "Updates a payment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment successfully updated")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponseDTO> updatePaiement(
            @Parameter(description = "ID of the payment to update") @PathVariable Long id,
            @Valid @RequestBody PaiementUpdateDTO dto) {
        log.info("Updating payment with ID: {} with data: {}", id, dto);
        PaiementResponseDTO response = paiementService.updatePaiement(id, dto);
        log.info("Successfully updated payment with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a payment by ID",
            description = "Retrieves a payment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment found and returned")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponseDTO> getPaiementById(
            @Parameter(description = "ID of the payment to retrieve") @PathVariable Long id) {
        log.debug("Fetching payment with ID: {}", id);
        PaiementResponseDTO response = paiementService.getPaiementById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all payments",
            description = "Retrieves a list of all payments in the system")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<List<PaiementResponseDTO>> getAllPaiements() {
        log.debug("Fetching all payments");
        List<PaiementResponseDTO> response = paiementService.getAllPaiements();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a payment",
            description = "Deletes a payment based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Payment successfully deleted")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<Void> deletePaiement(
            @Parameter(description = "ID of the payment to delete") @PathVariable Long id) {
        log.info("Deleting payment with ID: {}", id);
        paiementService.deletePaiement(id);
        log.info("Successfully deleted payment with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
