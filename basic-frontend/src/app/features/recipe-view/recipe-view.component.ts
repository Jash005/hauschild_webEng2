import { Component, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
/* ----------- Initialisierung -----------*/
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
  recipe2send: any = {};


  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) {
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
      this.router.navigate(['/']).then(response => console.log(response));
    }
    this.removeQueryParams(['selectedRecipe', 'author', 'selectedUser']).then(response => console.log(response));
  }


/* ----------- Ranking eines Rezepts ----------- */
  async addLike(): Promise<void> {
    this.rating += 1;
    this.isLiked = true;
    try {
      await this.ApiService.updateRecipeRating(this.recipeId, this.rating);
    } catch (error) {
      console.error('Fehler beim aktualisieren der Bewertung')
    }
  }
  async removeLike(): Promise<void> {
    this.rating -= 1;
    this.isLiked = false;
    try {
      await this.ApiService.updateRecipeRating(this.recipeId, this.rating);
    } catch (error) {
      console.error('Fehler beim aktualisieren der Bewertung')
    }
  }


/* ----------- Rezept bearbeiten Modus umschalten ----------- */
  editRecipe(): void {
    this.isEditing = !this.isEditing;
  }


/* ----------- API-Aufruf Rezeptdaten holen ----------- */
  getRecipeData(): void {
    this.ApiService.getRecipeById(this.recipeId).then((recipe: any) => {
      this.title = recipe.recipeTitle;
      this.category = recipe.recipeCategory;
      this.description = recipe.recipeDescription;
      this.ingredients = recipe.recipeIngredients;
      this.instruction = recipe.recipeInstruction;
      this.author = recipe.author;
      this.rating = recipe.rating;
      this.comments = recipe.comments;
      this.recipe2send = recipe;
    });
  }



/* ----------- API-Aufruf um Kommentar hinzuzufügen -----------*/
async addComment(): Promise<void> {
  let authorId = localStorage.getItem('userId') || "";
  this.comments.push({
    content: this.newCommentContent,
    author: this.currentUser,
    authorId: authorId,
    createdAt: new Date().toISOString()
  });
  try {
    await this.ApiService.addCommentToRecipe(this.recipeId, this.newCommentContent, this.currentUser, authorId);
    this._snackBar.open('Kommentar hinzugefügt', 'x', { duration: 2000 });
    this.showCommentField = false;
    this.newCommentContent = "";
  } catch (error) {
    console.error('Fehler beim hinzufügen des Kommentars', error);
      this._snackBar.open('Fehler beim hinzufügen des Kommentars', 'x', { duration: 2000 });
      const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
      if (snackBarElement) {
        (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
      }
  }
}

/* ----------- API-Aufruf zum Löschen eines Rezepts ----------- */
  async deleteRecipe(): Promise<void> {
    const confirmation = confirm('Sind Sie sicher, dass Sie das Rezept löschen möchten?');

    if(confirmation) {
      try {
        await this.ApiService.deleteRecipe(this.recipeId);
        this._snackBar.open('Rezept wurde gelöscht', 'x', { duration: 2000 });
        await this.router.navigate(['/']);
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
  async removeQueryParams(paramsToRemove: string[]): Promise<void> {
    const queryParams = { ...this.route.snapshot.queryParams };
    paramsToRemove.forEach(param => delete queryParams[param]);

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }
}
