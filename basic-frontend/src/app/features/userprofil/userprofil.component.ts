import { Component } from '@angular/core';

@Component({
  selector: 'app-userprofil',
  standalone: true,
  imports: [],
  templateUrl: './userprofil.component.html',
  styleUrl: './userprofil.component.css'
})
export class UserprofilComponent {
  username = localStorage.getItem('username');
  recipes = localStorage.getItem('recipes');
  comments = localStorage.getItem('comments');

  constructor() { }

  viewRecipe() {
    this.recipes = localStorage.getItem('recipes');
  }
  viewRecipeWithComments() {
    this.comments = localStorage.getItem('comments');
  }
}
