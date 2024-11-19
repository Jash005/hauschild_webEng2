import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  //TODO - Implementierung
  // private _snackBar = inject(MatSnackBar);
  // recipeForm: FormGroup;

  // constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
  //   this.recipeForm = this.fb.group({
  //     title: ['', Validators.required],
  //     description: ['', Validators.required],
  //     ingredients: ['', Validators.required],
  //     instructions: ['', Validators.required]
  //   });
  // }

  // ngOnInit(): void {
  // }

  // async submitForm(): Promise<void> {
  //   if (this.recipeForm.valid) {
  //     try {
  //       const response = await this.apiService.createRecipe(this.recipeForm.value);
  //       console.log('Rezept erfolgreich erstellt', response);
  //       this._snackBar.open('Rezept erfolgreich erstellt', 'x', { duration: 2000 });
  //       this.router.navigate(['/']);
  //     } catch (error) {
  //       console.error('Fehler beim Erstellen des Rezepts', error);
  //       this._snackBar.open('Fehler beim Erstellen des Rezepts', 'x', { duration: 2000 });

  //       const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
  //       if (snackBarElement) {
  //         (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
  //       }
  //     }
  //   }
  // }
}
