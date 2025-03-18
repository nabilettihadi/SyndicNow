import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models/incident.model';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent implements OnInit {
  incidentForm: FormGroup;
  isEditMode = false;
  incidentId?: number;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.incidentForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priorite: ['MOYENNE', Validators.required],
      type: ['TECHNIQUE', Validators.required],
      immeubleId: ['', Validators.required]
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
  }

  loadIncident(): void {
    if (this.incidentId) {
      this.incidentService.getIncidentById(this.incidentId).subscribe({
        next: (incident) => {
          this.incidentForm.patchValue({
            titre: incident.titre,
            description: incident.description,
            priorite: incident.priorite,
            type: incident.type,
            immeubleId: incident.immeuble.id
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'incident:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      const incidentData = this.incidentForm.value;
      
      if (this.isEditMode && this.incidentId) {
        this.incidentService.updateIncident(this.incidentId, incidentData).subscribe({
          next: () => {
            this.router.navigate(['/incidents']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'incident:', error);
          }
        });
      } else {
        this.incidentService.createIncident(incidentData).subscribe({
          next: () => {
            this.router.navigate(['/incidents']);
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'incident:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/incidents']);
  }
} 