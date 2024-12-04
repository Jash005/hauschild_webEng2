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

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon
  ],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  private _snackBar = inject(MatSnackBar);
  recipeForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recipeForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      recipeDescription: ['', Validators.required],
      recipeIngredients: this.fb.array([this.createIngredientField()]),
      recipeInstruction: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

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

  prepareIngredientsArray(): void {
    for (let i = 0; i < this.recipeForm.value.recipeIngredients.length; i++) {
      let namePattern = 'ingName_'+i;
      let inputElem = document.getElementById(namePattern) as HTMLInputElement;
      if (inputElem.value != null) {
        this.recipeForm.value.recipeIngredients[i] = inputElem.value;
      }
    }
    this.recipeForm.value.recipeIngredients = this.recipeForm.value.recipeIngredients.filter((ingredient: string) => ingredient.trim() !== '');
  }

  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
        this.prepareIngredientsArray();
        console.log('rezeptZutaten: ' + this.recipeForm.value.recipeIngredients);
      try {
        const formValue = this.recipeForm.value;
        formValue.author = localStorage.getItem('username');

        const response = await this.apiService.createRecipe(formValue);
        console.log('Rezept erfolgreich erstellt', response);
        this._snackBar.open('Rezept erfolgreich erstellt', 'x', { duration: 2000 });
        this.router.navigate(['/']);
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
