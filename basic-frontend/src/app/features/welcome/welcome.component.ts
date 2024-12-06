import { DatePipe } from '@angular/common';
import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  providers: [ApiService]
})
export class WelcomeComponent implements OnInit {
  allUserArray: any[] = [];
  allRecipeArray: any[] = [];
  username: string = "";
  userId: string = "";
  recipeTitle: string = "";
  recipeAuthor: string = "";
  recipeDescription: string = "";
  recipeCategory: string = "";
  recipeRating: number = 0;

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getRecipeData();
    this.getUserData();
  }

  getRecipeData(): void {
    this.ApiService.getAllRecipes().then((recipe: any) => {
      this.allRecipeArray = recipe;
      // // this.recipeTitle = recipe.recipeTitle;
      // // this.recipeAuthor = recipe.author;
      // // this.recipeDescription = recipe.recipeDescription;
      // // this.recipeCategory = recipe.recipeCategory || "Unkatagorisiert";
      // // this.recipeRating = recipe.rating;
      console.log(this.allRecipeArray);
    });
  }
  getUserData(): void {
    this.ApiService.getAllUser().then((userData: any) => {
      this.allUserArray = userData;
      console.log(this.allUserArray);
    });
  }

}
