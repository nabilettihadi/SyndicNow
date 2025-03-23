package ma.Nabil.SyndicNow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.incident.IncidentRequest;
import ma.Nabil.SyndicNow.dto.incident.IncidentResponse;
import ma.Nabil.SyndicNow.enums.IncidentPriority;
import ma.Nabil.SyndicNow.enums.IncidentStatus;
import ma.Nabil.SyndicNow.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC', 'PROPRIETAIRE')")
    @Operation(summary = "Create a new incident", description = "Creates a new incident in the system")
    @ApiResponse(responseCode = "201", description = "Incident created successfully")
    public ResponseEntity<IncidentResponse> createIncident(@RequestBody IncidentRequest request) {
        log.debug("Creating new incident with request: {}", request);
        IncidentResponse response = incidentService.createIncident(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Update an incident", description = "Updates an existing incident")
    @ApiResponse(responseCode = "200", description = "Incident updated successfully")
    public ResponseEntity<IncidentResponse> updateIncident(@PathVariable Long id, @RequestBody IncidentRequest request) {
        log.debug("Updating incident with ID: {} and request: {}", id, request);
        IncidentResponse response = incidentService.updateIncident(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Delete an incident", description = "Deletes an existing incident")
    @ApiResponse(responseCode = "204", description = "Incident deleted successfully")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        log.debug("Deleting incident with ID: {}", id);
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC', 'PROPRIETAIRE')")
    @Operation(summary = "Get incident by ID", description = "Retrieves an incident by its ID")
    @ApiResponse(responseCode = "200", description = "Incident retrieved successfully")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        log.debug("Fetching incident with ID: {}", id);
        IncidentResponse response = incidentService.getIncidentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Get all incidents", description = "Retrieves a list of all incidents")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getAllIncidents() {
        log.debug("Fetching all incidents");
        List<IncidentResponse> response = incidentService.getAllIncidents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Get incidents by status", description = "Retrieves a list of incidents by their status")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByStatus(@PathVariable IncidentStatus status) {
        log.debug("Fetching incidents with status: {}", status);
        List<IncidentResponse> response = incidentService.getIncidentsByStatus(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Get incidents by priority", description = "Retrieves a list of incidents by their priority")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByPriority(@PathVariable IncidentPriority priority) {
        log.debug("Fetching incidents with priority: {}", priority);
        List<IncidentResponse> response = incidentService.getIncidentsByPriority(priority);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/immeuble/{immeubleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Get incidents by immeuble", description = "Retrieves a list of incidents for a specific immeuble")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByImmeuble(@PathVariable Long immeubleId) {
        log.debug("Fetching incidents for immeuble with ID: {}", immeubleId);
        List<IncidentResponse> response = incidentService.getIncidentsByImmeubleId(immeubleId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appartement/{appartementId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC', 'PROPRIETAIRE')")
    @Operation(summary = "Get incidents by appartement", description = "Retrieves a list of incidents for a specific appartement")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByAppartement(@PathVariable Long appartementId) {
        log.debug("Fetching incidents for appartement with ID: {}", appartementId);
        List<IncidentResponse> response = incidentService.getIncidentsByAppartementId(appartementId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/syndic/{syndicId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Get incidents by syndic", description = "Retrieves a list of incidents assigned to a specific syndic")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsBySyndic(@PathVariable Long syndicId) {
        log.debug("Fetching incidents for syndic with ID: {}", syndicId);
        List<IncidentResponse> response = incidentService.getIncidentsByAssignedTo(syndicId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/proprietaire/{proprietaireId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC', 'PROPRIETAIRE')")
    @Operation(summary = "Get incidents by proprietaire", description = "Retrieves a list of incidents reported by a specific proprietaire")
    @ApiResponse(responseCode = "200", description = "List of incidents retrieved successfully")
    public ResponseEntity<List<IncidentResponse>> getIncidentsByProprietaire(@PathVariable Long proprietaireId) {
        log.debug("Fetching incidents for proprietaire with ID: {}", proprietaireId);
        List<IncidentResponse> response = incidentService.getIncidentsByReportedBy(proprietaireId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Update incident status", description = "Updates the status of an incident")
    @ApiResponse(responseCode = "200", description = "Incident status updated successfully")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(@PathVariable Long id, @RequestParam IncidentStatus status) {
        log.debug("Updating status for incident with ID: {} to status: {}", id, status);
        IncidentResponse response = incidentService.updateIncidentStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/priority")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Update incident priority", description = "Updates the priority of an incident")
    @ApiResponse(responseCode = "200", description = "Incident priority updated successfully")
    public ResponseEntity<IncidentResponse> updateIncidentPriority(@PathVariable Long id, @RequestParam IncidentPriority priority) {
        log.debug("Updating priority for incident with ID: {} to priority: {}", id, priority);
        IncidentResponse response = incidentService.updateIncidentPriority(id, priority);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Assign incident to syndic", description = "Assigns an incident to a specific syndic")
    @ApiResponse(responseCode = "200", description = "Incident assigned successfully")
    public ResponseEntity<IncidentResponse> assignIncident(@PathVariable Long id, @RequestParam Long syndicId) {
        log.debug("Assigning incident with ID: {} to syndic with ID: {}", id, syndicId);
        IncidentResponse response = incidentService.assignIncident(id, syndicId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SYNDIC')")
    @Operation(summary = "Resolve incident", description = "Marks an incident as resolved with a resolution message")
    @ApiResponse(responseCode = "200", description = "Incident resolved successfully")
    public ResponseEntity<IncidentResponse> resolveIncident(@PathVariable Long id, @RequestParam String resolution) {
        log.debug("Resolving incident with ID: {} with resolution: {}", id, resolution);
        IncidentResponse response = incidentService.resolveIncident(id, resolution);
        return ResponseEntity.ok(response);
    }
} 