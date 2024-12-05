import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.css'
})
export class RecipeViewComponent {
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

}
