import { Component, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { NgModel, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltip,
    FormsModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
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

  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) { }

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

  getRecipeData(): void {
    console.log('Recipe ID:', this.recipeId);
    this.ApiService.getRecipeById(this.recipeId).then((recipe: any) => {
      this.title = recipe.recipeTitle;
      this.category = recipe.recipeCategory;
      this.description = recipe.recipeDescription;
      this.ingredients = recipe.recipeIngredients;
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
    try {
      const response = this.ApiService.addCommentToRecipe(this.recipeId, this.newCommentContent, this.currentUser);
      console.log('Kommentar hinzugefügt', response);
      this._snackBar.open('Kommentar hinzugefügt', 'x', { duration: 2000 });
    } catch (error) {
        console.error(error);

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
