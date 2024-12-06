import { DatePipe } from '@angular/common';
import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { RouterLink } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CdkAccordionModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  providers: [ApiService]
})
export class WelcomeComponent implements OnInit {
  allUserArray: any[] = [];
  allRecipeArray: any[] = [];
  topRecipeArray: any[] = [];
  recipeCategorysInDatabase: any[] = [];
  username: string = "";
  userId: string = "";
  recipeTitle: string = "";
  recipeAuthor: string = "";
  recipeDescription: string = "";
  recipeCategory: string = "";
  recipeRating: number = 0;

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor(private ApiService: ApiService) {
  }

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
      this.extractCategories()
    });
  }
  getTopRecipeData(): void {
    this.ApiService.getTopRecipes().then((resData: any) => {
      this.topRecipeArray = resData;
      console.log('TOP 5', this.topRecipeArray);
    });
  }


  extractCategories(): void {
    const categorySet = new Set<string>();
    this.allRecipeArray.forEach(elem => {
      if (elem.recipeCategory) {
        categorySet.add(elem.recipeCategory);
      }
    });
    this.recipeCategorysInDatabase = Array.from(categorySet).sort((a, b) => {
      if (a === 'Unkategorisiert') return 1;
      if (b === 'Unkategorisiert') return -1;
      return a.localeCompare(b);
    });
    console.log(this.recipeCategorysInDatabase);
  }

}
