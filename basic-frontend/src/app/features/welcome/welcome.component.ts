import { DatePipe } from '@angular/common';
import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
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
  topRecipeArray: any[] = [];
  username: string = "";
  userId: string = "";
  recipeTitle: string = "";
  recipeAuthor: string = "";
  recipeDescription: string = "";
  recipeCategory: string = "";
  recipeRating: number = 0;

  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
    this.getUserData();
    this.getRecipeData();
    this.getTopRecipeData();
  }

  getUserData(): void {
    this.ApiService.getAllUser().then((resData: any) => {
      this.allUserArray = resData;
      console.log(this.allUserArray);
    });
  }
  getRecipeData(): void {
    this.ApiService.getAllRecipes().then((resData: any) => {
      this.allRecipeArray = resData;
      console.log(this.allRecipeArray);
    });
  }
  getTopRecipeData(): void {
    this.ApiService.getTopRecipes().then((resData: any) => {
      this.topRecipeArray = resData;
      console.log('TOP 5', this.topRecipeArray);
    });
  }

}
