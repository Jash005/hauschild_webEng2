import { RecipeViewComponent } from './../recipe-view/recipe-view.component';
import { Component, inject, input, Input } from '@angular/core';
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
export class RecipeEditComponent  {
  @Input() recipe2send: any = {};
 // @Input() isEditing2send: boolean = false;


  private _snackBar = inject(MatSnackBar);
  recipeForm: FormGroup;
  categories: string[] = ['Unkategorisiert', 'Fleisch', 'Fisch', 'Geflügel', 'Pasta', 'Asiatisch', 'Dessert', 'Beilage', 'Vegetarisch', 'Vegan', 'Sonstiges'];
  valueIngredientArray: string[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.recipeForm = this.fb.group({
      recipeTitle: ['', Validators.required],
      recipeCategory: ['Unkategorisiert'],
      recipeDescription: ['', Validators.required],
      recipeIngredients: [''],
      recipeInstruction: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const recipeData = this.recipe2send;

    this.recipeForm.patchValue({
      recipeTitle: recipeData.recipeTitle,
      recipeCategory: recipeData.recipeCategory,
      recipeDescription: recipeData.recipeDescription,
      recipeIngredients: recipeData.recipeIngredients,
      recipeInstruction: recipeData.recipeInstruction
    });

  }

  // get recipeIngredients() {
  //   return this.recipeForm.get('recipeIngredients') as FormArray;
  // }
  // createIngredientField(): FormControl {
  //   return this.fb.control('');
  // }
  // addIngredientsField() {
  //   this.recipeIngredients.push(this.createIngredientField());
  // }
  // removeIngredientField(index: number) {
  //   this.recipeIngredients.removeAt(index);
  // }

  async submitForm(): Promise<void> {
    if (this.recipeForm.valid) {
      try {
        const formValue = { ...this.recipeForm.value };

        console.log('neueIngredients:', formValue.recipeIngredients);
        if (!Array.isArray(formValue.recipeIngredients)) {
          formValue.recipeIngredients = formValue.recipeIngredients
            .split(',')
            .map((ingredient: string) => ingredient.trim())
            .filter((ingredient: string) => ingredient !== '');
        }

        formValue.author = localStorage.getItem('username');
        formValue.authorId = localStorage.getItem('userId');
        const response = await this.apiService.editRecipe(this.recipe2send._id, formValue);
        console.log('Rezept erfolgreich bearbeitet', response);
        this._snackBar.open('Rezept erfolgreich bearbeitet', 'x', { duration: 2000 });
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Fehler beim Bearbeiten des Rezepts', error);
        this._snackBar.open('Fehler beim Bearbeiten des Rezepts', 'x', { duration: 2000 });

        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      } finally {
        this._snackBar.open('Rezept erfolgreich bearbeitet', 'x', { duration: 2000 });
        this.router.navigate(['/']);
      }
    }
  }
}
