import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) {
  }
  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('selectedUser') || '';
    this.getUserById();
    this.getRecipesFromUser(this.userId);
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
      console.log("HIER:--- ",this.recipesFromUser);
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
