package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;
import ma.Nabil.SyndicNow.service.PaiementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/paiements")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment Management", description = "APIs for managing payments")
public class PaiementController {

    private final PaiementService paiementService;

    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics", description = "Retrieves payment statistics")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    public ResponseEntity<Map<String, Object>> getPaiementStatistics() {
        log.debug("Fetching payment statistics");
        Map<String, Object> statistics = paiementService.getPaiementStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Create a new payment", description = "Creates a new payment with the provided information")
    @ApiResponse(responseCode = "201", description = "Payment successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    public ResponseEntity<PaiementResponse> createPaiement(@Valid @RequestBody PaiementRequest request) {
        log.info("Creating new payment with data: {}", request);
        PaiementResponse response = paiementService.createPaiement(request);
        log.info("Successfully created payment with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Update an existing payment", description = "Updates a payment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment successfully updated")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponse> updatePaiement(@Parameter(description = "ID of the payment to update") @PathVariable Long id, @Valid @RequestBody PaiementRequest request) {
        log.info("Updating payment with ID: {} with data: {}", id, request);
        PaiementResponse response = paiementService.updatePaiement(id, request);
        log.info("Successfully updated payment with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a payment by ID", description = "Retrieves a payment's information based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment found and returned")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponse> getPaiementById(@Parameter(description = "ID of the payment to retrieve") @PathVariable Long id) {
        log.debug("Fetching payment with ID: {}", id);
        PaiementResponse response = paiementService.getPaiementById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all payments", description = "Retrieves a list of all payments in the system")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<Page<PaiementResponse>> getAllPaiements(Pageable pageable) {
        log.debug("Fetching all payments");
        Page<PaiementResponse> response = paiementService.getAllPaiements(pageable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Delete a payment", description = "Deletes a payment based on the provided ID")
    @ApiResponse(responseCode = "204", description = "Payment successfully deleted")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<Void> deletePaiement(@Parameter(description = "ID of the payment to delete") @PathVariable Long id) {
        log.info("Deleting payment with ID: {}", id);
        paiementService.deletePaiement(id);
        log.info("Successfully deleted payment with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reference/{reference}")
    @Operation(summary = "Get a payment by reference", description = "Retrieves a payment's information based on the provided reference")
    @ApiResponse(responseCode = "200", description = "Payment found and returned")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponse> getPaiementByReference(@PathVariable String reference) {
        log.debug("Fetching payment with reference: {}", reference);
        PaiementResponse response = paiementService.getPaiementByReference(reference);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appartement/{appartementId}")
    @Operation(summary = "Get payments by appartement", description = "Retrieves a list of payments for a specific appartement")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<Page<PaiementResponse>> getPaiementsByAppartement(@PathVariable Long appartementId, Pageable pageable) {
        log.debug("Fetching payments for appartement with ID: {}", appartementId);
        Page<PaiementResponse> response = paiementService.getPaiementsByAppartement(appartementId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status", description = "Retrieves a list of payments for a specific status")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<Page<PaiementResponse>> getPaiementsByStatus(@PathVariable PaiementStatus status, Pageable pageable) {
        log.debug("Fetching payments for status: {}", status);
        Page<PaiementResponse> response = paiementService.getPaiementsByStatus(status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get payments by type", description = "Retrieves a list of payments for a specific type")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<Page<PaiementResponse>> getPaiementsByType(@PathVariable PaiementType type, Pageable pageable) {
        log.debug("Fetching payments for type: {}", type);
        Page<PaiementResponse> response = paiementService.getPaiementsByType(type, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/immeuble/{immeubleId}")
    @Operation(summary = "Get payments by immeuble", description = "Retrieves a list of payments for a specific immeuble")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<Page<PaiementResponse>> getPaiementsByImmeuble(@PathVariable Long immeubleId, Pageable pageable) {
        log.debug("Fetching payments for immeuble with ID: {}", immeubleId);
        Page<PaiementResponse> response = paiementService.getPaiementsByImmeuble(immeubleId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Get overdue payments", description = "Retrieves a list of overdue payments")
    @ApiResponse(responseCode = "200", description = "List of overdue payments retrieved successfully")
    public ResponseEntity<List<PaiementResponse>> getOverduePaiements() {
        log.debug("Fetching overdue payments");
        List<PaiementResponse> response = paiementService.getOverduePaiements();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total/appartement/{appartementId}")
    @Operation(summary = "Get total payments by status and appartement", description = "Retrieves the total amount of payments for a specific status and appartement")
    @ApiResponse(responseCode = "200", description = "Total amount retrieved successfully")
    public ResponseEntity<Double> getTotalPaiementsByStatusAndAppartement(@RequestParam PaiementStatus status, @PathVariable Long appartementId) {
        log.debug("Fetching total payments for status: {} and appartement with ID: {}", status, appartementId);
        Double response = paiementService.getTotalPaiementsByStatusAndAppartement(status, appartementId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total/immeuble/{immeubleId}")
    @Operation(summary = "Get total payments by status and immeuble", description = "Retrieves the total amount of payments for a specific status and immeuble")
    @ApiResponse(responseCode = "200", description = "Total amount retrieved successfully")
    public ResponseEntity<Double> getTotalPaiementsByStatusAndImmeuble(@RequestParam PaiementStatus status, @PathVariable Long immeubleId) {
        log.debug("Fetching total payments for status: {} and immeuble with ID: {}", status, immeubleId);
        Double response = paiementService.getTotalPaiementsByStatusAndImmeuble(status, immeubleId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/mark-as-paid")
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Mark a payment as paid", description = "Marks a payment as paid based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment marked as paid")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponse> markAsPaid(@PathVariable Long id) {
        log.info("Marking payment with ID: {} as paid", id);
        PaiementResponse response = paiementService.markAsPaid(id);
        log.info("Successfully marked payment with ID: {} as paid", id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('SYNDIC')")
    @Operation(summary = "Cancel a payment", description = "Cancels a payment based on the provided ID")
    @ApiResponse(responseCode = "200", description = "Payment canceled")
    @ApiResponse(responseCode = "404", description = "Payment not found")
    public ResponseEntity<PaiementResponse> cancelPaiement(@PathVariable Long id) {
        log.info("Canceling payment with ID: {}", id);
        PaiementResponse response = paiementService.cancelPaiement(id);
        log.info("Successfully canceled payment with ID: {}", id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/proprietaire/{proprietaireId}")
    @Operation(summary = "Get payments by proprietaire", description = "Retrieves a list of payments for a specific proprietaire")
    @ApiResponse(responseCode = "200", description = "List of payments retrieved successfully")
    public ResponseEntity<List<PaiementResponse>> getPaiementsByProprietaire(@PathVariable Long proprietaireId) {
        log.debug("Fetching payments for proprietaire with ID: {}", proprietaireId);
        List<PaiementResponse> response = paiementService.getPaiementsByProprietaire(proprietaireId);
        return ResponseEntity.ok(response);
    }
}
