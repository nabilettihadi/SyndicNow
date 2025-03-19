import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models/incident.model';
import { ImmeubleService } from '../../../core/services/immeuble.service';
import { Immeuble } from '../../../core/models/immeuble.model';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent implements OnInit {
  incidentForm: FormGroup;
  immeubles: Immeuble[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  incidentId: number = 0;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private immeubleService: ImmeubleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.incidentForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: ['MOYENNE', Validators.required],
      immeubleId: [null, Validators.required],
      status: ['EN_COURS', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.incidentId = +params['id'];
        this.loadIncident();
      }
    });

    this.loadImmeubles();
  }

  private loadImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe((immeubles: Immeuble[]) => {
      this.immeubles = immeubles;
    });
  }

  private loadIncident(): void {
    this.loading = true;
    this.incidentService.getIncidentById(this.incidentId).subscribe({
      next: (incident: Incident) => {
        this.incidentForm.patchValue({
          titre: incident.titre,
          description: incident.description,
          priorite: incident.priorite,
          immeubleId: incident.immeuble?.id,
          status: incident.statut
        });
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement de l\'incident';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      this.loading = true;
      const incidentData = this.incidentForm.value;

      const operation = this.isEditMode
        ? this.incidentService.updateIncident(this.incidentId, incidentData)
        : this.incidentService.createIncident(incidentData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/incidents']);
        },
        error: (error: Error) => {
          this.error = 'Erreur lors de la sauvegarde de l\'incident';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/incidents']);
  }
} 