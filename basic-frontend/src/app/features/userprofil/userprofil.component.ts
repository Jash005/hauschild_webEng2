import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-userprofil',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './userprofil.component.html',
  styleUrl: './userprofil.component.css',
  providers: [ApiService]
})
export class UserprofilComponent implements OnInit {
  userId: string = "";
  username: string = "";
  userData: any;
  createdAt: Date = new Date();
  recipes = localStorage.getItem('recipes');
  comments = localStorage.getItem('comments');
  recipesFromUser: any[] = [];
  commentsFromAllUser: any[] = [];
  filteredComments: any[] = [];
  filteredCommentsRecipeTitle: string = "";
  preparedComments: any[] = [];

  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) {
  }
  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('selectedUser') || '';
    this.getUserById();
    this.getRecipesFromUser(this.userId);
    this.getCommentsByUserId(this.userId);
    this.removeQueryParams(['selectedRecipe', 'author']);
  }

  getUserById(): void {
    this.ApiService.getUserById(this.userId).then((userData: any) => {
      this.userData = userData;
      this.username = this.userData.username;
      this.createdAt = this.userData.createdAt;
      console.log(this.userData);
    });
  }

  viewRecipe() {
    this.recipes = localStorage.getItem('recipes');
  }
  viewRecipeWithComments() {
    this.comments = localStorage.getItem('comments');
  }

  getRecipesFromUser(userId: string) {
    this.ApiService.getRecipesByUserId(userId).then((resData: any) => {
      this.recipesFromUser.push(resData);
    });
  }
  getCommentsByUserId(userId: string) {
    this.ApiService.getCommentsByUserId(userId).then((resData: any) => {
      // Arrays leeren um doppelte Einträge zu vermeiden
      const preparedComments: any[] = [];
      this.commentsFromAllUser = [];

      resData.forEach((recipe: any) => {
        const recipeTitle = recipe.recipeTitle;
        const recipeId = recipe._id;
        recipe.comments.forEach((comment: any) => {
          if (comment.authorId === this.userId) {
            preparedComments.push({
              ...comment,
              recipeTitle: recipeTitle,
              recipeId: recipeId
            });
          }
        });
      });

      this.filteredComments = preparedComments.filter((comment: any) => comment.authorId === this.userId);
    });
  }

  removeQueryParams(paramsToRemove: string[]): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    paramsToRemove.forEach(param => delete queryParams[param]);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

}
