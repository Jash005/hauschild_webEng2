import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
  currentUser: any = localStorage.getItem('currentUser') || null;
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
      this.rating = recipe.rating;
      this.comments = recipe.comments;
    });
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
