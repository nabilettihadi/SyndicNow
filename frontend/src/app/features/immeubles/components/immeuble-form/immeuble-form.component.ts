import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ImmeubleService, ImmeubleCreate } from '../../services/immeuble.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-immeuble-form',
  templateUrl: './immeuble-form.component.html',
  styleUrls: ['./immeuble-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent]
})
export class ImmeubleFormComponent implements OnInit {
  immeubleForm: FormGroup;
  isEditMode = false;
  immeubleId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.immeubleForm = this.fb.group({
      nom: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      codePostal: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      nombreEtages: ['', [Validators.required, Validators.min(1)]],
      nombreAppartements: ['', [Validators.required, Validators.min(1)]],
      anneeConstruction: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.immeubleId = +id;
      this.loadImmeuble(this.immeubleId);
    }
  }

  loadImmeuble(id: number): void {
    this.loading = true;
    this.immeubleService.getImmeubleById(id).subscribe({
      next: (immeuble) => {
        this.immeubleForm.patchValue(immeuble);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'immeuble';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.immeubleForm.valid) {
      this.loading = true;
      const immeubleData: ImmeubleCreate = {
        ...this.immeubleForm.value,
        syndicId: this.authService.getCurrentUserId() || 0
      };

      const request$ = this.isEditMode && this.immeubleId
        ? this.immeubleService.updateImmeuble(this.immeubleId, immeubleData)
        : this.immeubleService.createImmeuble(immeubleData);

      request$.subscribe({
        next: () => {
          this.router.navigate(['/immeubles']);
        },
        error: (error) => {
          this.error = 'Erreur lors de l\'enregistrement de l\'immeuble';
          this.loading = false;
        }
      });
    }
  }
} 