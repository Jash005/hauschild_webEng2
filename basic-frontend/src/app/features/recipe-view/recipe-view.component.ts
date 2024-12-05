import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatTooltip
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
  private _snackBar = inject(MatSnackBar);
  currentUser: string = localStorage.getItem('username') || "Gast";
  isLiked: boolean = false;
  recipeId: string = localStorage.getItem('recipeId') || "HkwJgJnCrVU67Mmw";
  title:string = "";
  description: string = "";
  ingredients: string[] = [];
  instruction:string = "";
  author: string = "";
  createAt: Date = new Date();
  rating:number = 0;
  comments: { content: string, author: string, date: string }[] = [];

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getRecipeData();
  }

  getRecipeData(): void {
    this.ApiService.getRecipeById(this.recipeId).then((recipe: any) => {
      this.title = recipe.recipeTitle;
      this.description = recipe.recipeDescription;
      this.ingredients = recipe.recipeIngredients;
      this.instruction = recipe.recipeInstruction;
      this.author = recipe.author;
      this.rating = recipe.rating;
      this.comments = recipe.comments;
    });
  }

  getStatusMessage(messageCase:string):void {
    let messageText = "";
    switch (messageCase) {
      case "sameAsAuthor":
        messageText = "Du kannst kannst dein eigenes Rezept nicht bewerten";
        break;
      case "noLogin":
        messageText = "Du musst angemeldet sein um eine Bewertung abzugeben - <a routerLink='/login'>Login</a>";
        break;
    }
    this._snackBar.open(messageText, '', { duration: 2000 });
  }
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



}
