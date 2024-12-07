import { Component, inject, OnInit, Input, NgModule } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RecipeEditComponent } from '../recipe-edit/recipe-edit.component';


@Component({
  selector: 'app-recipe-view',
  standalone: true,

  imports: [
    RecipeEditComponent,
    CommonModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltip,
    FormsModule,
    MatChipsModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  currentUser: string = localStorage.getItem('username') || "Gast";
  isLiked: boolean = false;
  recipeId: string = localStorage.getItem('recipeId') || "";
  title: string = "";
  category: string = "";
  description: string = "";
  ingredients: string[] = [];
  instruction:string = "";
  author: string = "";
  recipeAuthorId: string = "";
  createdAt: Date = new Date();
  rating: number = 0;
  comments: { content: string, author: string, authorId: string, createdAt: string }[] = [];
  showCommentField: boolean = false;
  newCommentContent: string = "";
  isEditing: boolean = false;
  // editedRecipeForm: FormGroup;
  // editedTitle: string = "";
  // editedIngredients: FormArray;
  // editedDescription: string = "";
  // editedInstruction: string = "";


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private ApiService: ApiService, private router: Router) {
    // this.editedRecipeForm = this.fb.group({
    //   editedTitle: [this.title, Validators.required],
    //   editedDescription: [this.description, Validators.required],
    //   editedIngredients: this.fb.array([]),
    //   editedInstruction: [this.instruction, Validators.required]
    // });
    // this.editedIngredients = this.editedRecipeForm.get('ingredients') as FormArray;
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.queryParamMap.get('selectedRecipe') || 'none';
    this.recipeAuthorId = this.route.snapshot.queryParamMap.get('author') || 'none';

    if(this.recipeId !== 'none') {
      this.getRecipeData();
    } else {
      this._snackBar.open('Rezept wurde nicht gefunden', 'x', { duration: 2000 });
      const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
      if (snackBarElement) {
        (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
      }
      this.router.navigate(['/']);
    }

    this.removeQueryParams(['author']);



  }

/* ----------- bekomme Daten ----------- */
  getRecipeData(): void {
    console.log('Recipe ID:', this.recipeId);
    this.ApiService.getRecipeById(this.recipeId).then((recipe: any) => {
      this.title = recipe.recipeTitle;
      this.category = recipe.recipeCategory;
      this.description = recipe.recipeDescription;
      this.ingredients = recipe.recipeIngredients;
      // this.editedIngredients = recipe.recipeIngredients;
      this.instruction = recipe.recipeInstruction;
      this.author = recipe.author;
      this.rating = recipe.rating;
      this.comments = recipe.comments;
    });
  }

/* ----------- Ranking ----------- */
  addLike(): void {
    this.rating += 1;
    this.isLiked = true;
    this.ApiService.updateRecipeRating(this.recipeId, this.rating);
  }
  removeLike(): void {
    this.rating -= 1;
    this.isLiked = false;
    this.ApiService.updateRecipeRating(this.recipeId, this.rating);
  }

  /* ----------- Comment -----------*/
  async addComment(): Promise<void> {
    let authorId = localStorage.getItem('userId') || "";
    this.comments.push({
      content: this.newCommentContent,
      author: this.currentUser,
      authorId: authorId,
      createdAt: new Date().toISOString()
    });
    console.log('neuer Kommentar:', this.newCommentContent);
    try {
      const response = this.ApiService.addCommentToRecipe(this.recipeId, this.newCommentContent, this.currentUser, authorId);
      console.log('Kommentar hinzugefügt', response);
      this._snackBar.open('Kommentar hinzugefügt', 'x', { duration: 2000 });
    } catch (error) {
      console.error('Fehler beim hinzufügen des Kommentars', error);
        this._snackBar.open('Fehler beim hinzufügen des Kommentars', 'x', { duration: 2000 });

        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
    }
    this.showCommentField = false;
    this.newCommentContent = "";
  }

/* ----------- Rezept bearbeiten ----------- */
  editRecipe(): void {
    this.isEditing = !this.isEditing;
  }
  //   // Werte kopieren
  //   this.editedTitle = this.title;
  //   this.editedDescription = this.description;
  //   //this.editedIngredients = this.ingredients;
  //   this.editedInstruction = this.instruction;

  //   console.log("HIER---", this.editedIngredients);
  // }
  // saveEditRecipe() {
  //   if (this.editedRecipeForm.valid) {
  //     this.title = this.editedRecipeForm.value.title;
  //     this.description = this.editedRecipeForm.value.description;
  //    // this.ingredients = this.editedRecipeForm.value.ingredients;
  //     this.instruction = this.editedRecipeForm.value.instruction;
  //     this.isEditing = false;
  //   }
  // }
  // createIngredientField(): FormControl {
  //   return this.fb.control('');
  // }
  // addIngredientsField() {
  //   this.editedIngredients.push(this.createIngredientField());
  // }
  // removeIngredientField(index: number) {
  //   this.editedIngredients.removeAt(index);
  // }

  // async submitForm(): Promise<void> {
  //   if (this.editedRecipeForm.valid) {
  //     //await this.prepareIngredientsArray();
  //     try {
  //     } catch (error) {
  //     }
  //   }
  // }

/* ----------- Lösche Rezept ----------- */
  deleteRecipe(): void {
    const confirmation = confirm('Sind Sie sicher, dass Sie das Rezept löschen möchten?');

    if(confirmation) {
      try {
        this.ApiService.deleteRecipe(this.recipeId);
        this._snackBar.open('Rezept wurde gelöscht', 'x', { duration: 2000 });
        this.router.navigate(['/']);
      } catch (error) {
          console.error('Fehler beim löschen des Rezepts', error);
          this._snackBar.open('Fehler beim löschen des Rezepts', 'x', { duration: 2000 });

          const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
          if (snackBarElement) {
            (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
          }
      }
    }
  }

  /* ----------- Query Parameter ----------- */
  removeQueryParams(paramsToRemove: string[]): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    paramsToRemove.forEach(param => delete queryParams[param]);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
}
