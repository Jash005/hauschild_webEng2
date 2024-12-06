import { Component, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { NgModel, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltip,
    FormsModule,
    MatChipsModule
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
  private _snackBar = inject(MatSnackBar);
  currentUser: string = localStorage.getItem('username') || "Gast";
  isLiked: boolean = false;
  recipeId: string = localStorage.getItem('recipeId') || "dTz8j1SJo9Jd5cg3";
  title: string = "";
  category: string = "";
  description: string = "";
  ingredients: string[] = [];
  instruction:string = "";
  author: string = "";
  createdAt: Date = new Date();
  rating: number = 0;
  comments: { content: string, author: string, createdAt: string }[] = [];
  showCommentField: boolean = false;
  newCommentContent: string = "";

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getRecipeData();
  }

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
    this.comments.push({
      content: this.newCommentContent,
      author: this.currentUser,
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

}
