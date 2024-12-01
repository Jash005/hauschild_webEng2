import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
      recipeIngredients: this.fb.array([]),
      recipeInstruction: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

// Getter for the tasks FormArray
get recipeIngredients(): FormArray {
  return this.recipeForm.get('tasks') as FormArray;
}
addIngredientsField(myName: string = '') {
  const ingredientsGroup = this.fb.group({
    ingredientItem: myName || '', // Default to an empty string
  });
  this.recipeIngredients.push(ingredientsGroup); // Add the task to the tasks array
}
removeIngredientField(index: number) {
  this.recipeIngredients.removeAt(index);
}

  // get recipeIngredients(): FormArray {
  //   return this.recipeForm.get('recipeIngredients') as FormArray;
  // }

  // createIngredientField(): FormGroup {
  //   return this.fb.group({
  //     ingredient: ['', [Validators.required, Validators.minLength(2)]]
  //   });
  // }

  // addIngredientField(): void {
  //   if (this.recipeIngredients.length < 15) {
  //     this.recipeIngredients.push(this.createIngredientField());
  //   }
  // }

  // removeIngredientField(index: number): void {
  //   if (this.recipeIngredients.length > 1) {
  //     this.recipeIngredients.removeAt(index);
  //   }
  // }

  // clearValue(index: number): void {
  //   const ingredientControl = this.recipeIngredients.at(index).get('ingredient');
  //   if (ingredientControl) {
  //     ingredientControl.setValue('');
  //   }
  // }

  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
      try {
        const formValue = this.recipeForm.value;
        // formValue.recipeIngredients = formValue.recipeIngredients
        //   .map((ingredient: any) => ingredient.ingredient)
        //   .filter((ingredient: string) => ingredient.trim() !== '');

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
