import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from "../../shared/services/api.service";
import { RouterLink } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CdkAccordionModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  providers: [ApiService]
})
export class WelcomeComponent {
/* ----------- Initialisierung -----------*/
  allUserArray: any[] = [];
  allRecipeArray: any[] = [];
  topRecipeArray: any[] = [];
  recipeCategorysInDatabase: any[] = [];
  username: string = "";
  userId: string = "";
  recipeTitle: string = "";
  recipeDescription: string = "";
  recipeCategory: string = "";

  constructor(private route: ActivatedRoute, private ApiService: ApiService, private router: Router) {
    this.getUserData();
    this.getRecipeData();
    this.getTopRecipeData();

    this.removeQueryParams(['selectedRecipe', 'author', 'selectedUser']);
  }


  /* ----------- AuthorID zu Rezepten zuorndnen für eine effizentere Datenverabreitung -----------*/
  addAuthorIdToRecipe(): void {
    this.allRecipeArray.forEach(recipe => {
      const user = this.allUserArray.find(user => user.username === recipe.author);
      if (user) {
        recipe.authorId = user._id;
      }
    });
  }

  /* ----------- Kategorien aus Rezepten extrahieren ----------- */
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
  }


  /* ----------- API-Aufruf alle Userdaten holen -----------*/
    getUserData(): void {
      this.ApiService.getAllUser().then((resData: any) => {
        this.allUserArray = resData;
      });
    }

  /* ----------- API-Aufruf alle Rezeptdaten holen -----------*/
    getRecipeData(): void {
      this.ApiService.getAllRecipes().then((resData: any) => {
        this.allRecipeArray = resData;

        this.addAuthorIdToRecipe();
        this.extractCategories()
      });
    }
    getTopRecipeData(): void {
      this.ApiService.getTopRecipes().then((resData: any) => {
        this.topRecipeArray = resData;
        this.addAuthorIdToRecipe();
      });
    }


  /* ----------- Query-Parameter aufräumen ----------- */
    removeQueryParams(paramsToRemove: string[]): void {
      const queryParams = { ...this.route.snapshot.queryParams };
      paramsToRemove.forEach(param => delete queryParams[param]);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams
      }).then(success => {
        if (success) {
          console.log('Navigation erfolgreich');
        } else {
          console.error('Navigation fehlgeschlagen');
        }
      }).catch(error => {
        console.error('Fehler bei der Navigation', error);
      });
    }

}
