import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-userprofil',
  standalone: true,
  imports: [],
  templateUrl: './userprofil.component.html',
  styleUrl: './userprofil.component.css',
  providers: [ApiService]
})
export class UserprofilComponent implements OnInit {
  userId: string = "";
  username: string = "";
  userData: any;
  recipes = localStorage.getItem('recipes');
  comments = localStorage.getItem('comments');

constructor(private route: ActivatedRoute, private ApiService: ApiService) {
}
ngOnInit() {
  this.userId = this.route.snapshot.queryParamMap.get('selectedUser') || '';
  this.getUserById();
}

getUserById(): void {
  this.ApiService.getUserById(this.userId).then((userData: any) => {
    this.userData = userData;
    this.username = this.userData.username;
    console.log(this.userData);
  });
}

  viewRecipe() {
    this.recipes = localStorage.getItem('recipes');
  }
  viewRecipeWithComments() {
    this.comments = localStorage.getItem('comments');
  }
}
