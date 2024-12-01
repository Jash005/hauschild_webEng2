import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
    MatFormFieldModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent {
  //TODO - Implementierung
  private _snackBar = inject(MatSnackBar);
  recipeForm: FormGroup;
  value: string = 'hier';
  ingredients: string[] = ['dummyIngredient'];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recipeForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      recipeDescription: ['', Validators.required],
      recipeIngredients: [''],
      recipeInstruction: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  get recipeIngredients(): FormGroup {
    return this.recipeForm.get('recipeIngredients') as FormGroup;
  }


  addIngredient(): void {
    if (this.ingredients.length > 15) {
      this.maxIngredients();
      return;
    } else {
      this.ingredients.push(this.value);
      console.log("hinzugefügt" + this.value);
      this.value = '';
    }

  }

  maxIngredients(): void {
    const errorMessage = 'Maximale Anzahl an Zutaten erreicht';
    this._snackBar.open(errorMessage, 'x', { duration: 2000 });

    const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
    if (snackBarElement) {
      (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
    }
  }

  // addIngredientField(): void {
  //   this.recipeIngredients.push(this.createIngredientField());
  // }

  // // removeIngredientField(index: number): void {
  // //   if (this.recipeIngredients.length > 1) {
  // //     this.recipeIngredients.removeAt(index);
  // //   }
  // // }

  // onIngredientInput(index: number): void {
  //   const ingredientControl = this.recipeIngredients.at(index).get('ingredient');
  //   if (ingredientControl && ingredientControl.value.length >= 3 && index === this.recipeIngredients.length - 1) {
  //     this.addIngredientField();
  //   }
  // }



  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
      try {
        const response = await this.apiService.createRecipe(this.recipeForm.value);
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
