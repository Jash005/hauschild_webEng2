
import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  providers: [ApiService]
})
export class WelcomeComponent implements OnInit {
  allUserArray: any[] = [];
  username: string = "";
  userId: string = "";

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getRecipeData();
    this.getUserData();
  }

  getRecipeData(): void {
    // this.ApiService.getAllRecipes().then((recipe: any) => {
    //   // this.title = recipe.recipeTitle;
    //   // this.category = recipe.recipeCategory;
    //   // this.description = recipe.recipeDescription;
    //   // this.ingredients = recipe.recipeIngredients;
    //   // this.instruction = recipe.recipeInstruction;
    //   // this.author = recipe.author;
    //   // this.rating = recipe.rating;
    //   // this.comments = recipe.comments;
    // });
  }
  getUserData(): void {
    this.ApiService.getAllUser().then((userData: any) => {
      this.allUserArray = userData;
      console.log(this.allUserArray);
    });
  }

}
