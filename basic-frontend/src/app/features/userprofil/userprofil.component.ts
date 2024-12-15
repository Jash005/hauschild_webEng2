import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-userprofil',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './userprofil.component.html',
  styleUrl: './userprofil.component.css',
  providers: [ApiService]
})
export class UserprofilComponent implements OnInit {
  /* ----------- Initialisierung -----------*/
  private _snackBar = inject(MatSnackBar);
  userId: string = "";
  userIdFromLoggedInUser: string = localStorage.getItem('userId') || "";
  username: string = "";
  userData: any;
  createdAt: Date = new Date();
  comments = localStorage.getItem('comments');
  recipesFromUser: any[] = [];
  commentsFromAllUser: any[] = [];
  filteredComments: any[] = [];

  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('selectedUser') || 'none';

    if (this.userId === 'none') {
      this._snackBar.open('Diesen Benutzer gibt es nicht mehr', 'x', { duration: 2000 });
      this.router.navigate(['/']).then(response => console.log(response));
    } else {
      this.getUserById();
      this.getRecipesFromUser(this.userId);
      this.getCommentsByUserId(this.userId);
      this.removeQueryParams(['selectedRecipe', 'author', 'selectedUser']);
    }
  }


  /* ----------- API-Aufruf Userdaten abrufen ----------- */
  getUserById(): void {
    this.ApiService.getUserById(this.userId).then((userData: any) => {
      this.userData = userData;
      this.username = this.userData.username;
      this.createdAt = this.userData.createdAt;
    });
  }

  /* ----------- API-Aufruf Rezepte von User holen ----------- */
  getRecipesFromUser(userId: string) {
    this.ApiService.getRecipesByUserId(userId).then((resData: any) => {
      this.recipesFromUser.push(resData);
    });
  }

  /* ----------- API-Aufruf Kommentare von User holen ----------- */
  getCommentsByUserId(userId: string) {
    this.ApiService.getCommentsByUserId(userId).then((resData: any) => {
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


  /* ----------- API-Aufruf User löschen ----------- */
  async deleteUser(): Promise<void> {
    const confirmation = confirm('Sind Sie sicher, dass Sie Ihr Benutzerkonto löschen möchten? - Ihre erstellen Rezepte bleiben erhalten');
    if (confirmation) {
      try {
        await this.ApiService.deleteUser(this.userId);
        this._snackBar.open('Benutzer wurde gelöscht', 'x', { duration: 2000 });
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.setItem('snackbarMessage', 'Benutzer wurde erfolgreich gelöscht');
        window.location.replace('/');
      } catch (error) {
        console.error('Fehler beim löschen des Benutzers', error);
        this._snackBar.open('Fehler beim löschen des Benutzers', 'x', { duration: 2000 });
        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      }
    }

  }


  /* ----------- Query-Parameter aufräumen -----------*/
  removeQueryParams(paramsToRemove: string[]): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    paramsToRemove.forEach(param => delete queryParams[param]);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    }).catch(error => {
      console.error('Fehler bei der Navigation', error);
    });
  }

}
