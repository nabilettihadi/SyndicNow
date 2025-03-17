import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {ImmeubleCreate, ImmeubleService} from '@core/services/immeuble.service';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-immeuble-form',
  templateUrl: './immeuble-form.component.html',
  styleUrls: ['./immeuble-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent]
})
export class ImmeubleFormComponent implements OnInit {
  @Output() onSubmitEvent = new EventEmitter<ImmeubleCreate>();
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
      const immeuble = {
        ...this.immeubleForm.value,
        syndicId: this.authService.getCurrentUser()?.userId || 0
      };
      this.onSubmitEvent.emit(immeuble);
    }
  }
}
