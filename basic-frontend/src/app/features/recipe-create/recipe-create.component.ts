import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIcon,
    MatRadioModule
  ],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
/* ----------- Initialisierung -----------*/
  private _snackBar = inject(MatSnackBar);
  recipeForm: FormGroup;
  categories: string[] = ['Unkategorisiert', 'Fleisch', 'Fisch', 'Geflügel', 'Pasta', 'Asiatisch', 'Dessert', 'Beilage', 'Vegetarisch', 'Vegan', 'Sonstiges'];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recipeForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      recipeCategory: ['Unkategorisiert'],
      recipeDescription: ['', Validators.required],
      recipeIngredients: this.fb.array([this.createIngredientField()]),
      recipeInstruction: ['', Validators.required]
    });
  }

/* ----------- komplexes Inputfeld für Zutaten -----------*/
  get recipeIngredients() {
    return this.recipeForm.get('recipeIngredients') as FormArray;
  }
  createIngredientField(): FormControl {
    return this.fb.control('');
  }
  addIngredientsField() {
    this.recipeIngredients.push(this.createIngredientField());
  }
  removeIngredientField(index: number) {
    this.recipeIngredients.removeAt(index);
  }

/* ----------- API-Aufruf Rezept erstellen -----------*/
  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
      try {
        const formValue = { ...this.recipeForm.value };
        formValue.recipeIngredients = formValue.recipeIngredients.filter((ingredient: string) => ingredient.trim() !== '');
        formValue.author = localStorage.getItem('username');
        formValue.authorId = localStorage.getItem('userId');
        await this.apiService.createRecipe(formValue);
        this._snackBar.open('Rezept erfolgreich erstellt', 'x', { duration: 2000 });
        await this.router.navigate(['/']);
      } catch (error) {
        console.error('Fehler beim Erstellen des Rezepts', error);
        this._snackBar.open('Fehler beim Erstellen des Rezepts', 'x', { duration: 2000 });
        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      }
    }
  }
}
