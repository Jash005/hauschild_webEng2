import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent {
  /* ----------- Initialisierung -----------*/
  @Input() recipe2send: any = {};
  private _snackBar = inject(MatSnackBar);
  recipeForm: FormGroup;
  categories: string[] = ['Unkategorisiert', 'Fleisch', 'Fisch', 'Geflügel', 'Pasta', 'Asiatisch', 'Dessert', 'Beilage', 'Vegetarisch', 'Vegan', 'Sonstiges'];


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recipeForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      recipeCategory: ['Unkategorisiert'],
      recipeDescription: ['', Validators.required],
      recipeIngredients: [''],
      recipeInstruction: ['', Validators.required]
    });
  }

  /* ----------- API-Aufruf zum bearbeiten eines Rezepts -----------*/
  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
      try {
        const formValue = { ...this.recipeForm.value };

        if (!Array.isArray(formValue.recipeIngredients)) {
          formValue.recipeIngredients = formValue.recipeIngredients
            .split(',')
            .map((ingredient: string) => ingredient.trim())
            .filter((ingredient: string) => ingredient !== '');
        }

        formValue.author = localStorage.getItem('username');
        formValue.authorId = localStorage.getItem('userId');
        await this.apiService.editRecipe(this.recipe2send._id, formValue);
        this._snackBar.open('Rezept erfolgreich bearbeitet', 'x', { duration: 2000 });
        await this.router.navigate(['/']);
      } catch (error) {
        console.error('Fehler beim Bearbeiten des Rezepts', error);
        this._snackBar.open('Fehler beim Bearbeiten des Rezepts', 'x', { duration: 2000 });

        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      } finally {
        this._snackBar.open('Rezept erfolgreich bearbeitet', 'x', { duration: 2000 });
        await this.router.navigate(['/']);
      }
    }
  }
}
