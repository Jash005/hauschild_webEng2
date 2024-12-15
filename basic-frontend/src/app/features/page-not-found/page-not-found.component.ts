import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

  /* ----------- Initalisierung -----------*/
  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private apiService: ApiService) { }


  /* ----------- API Aufruf zum zufälligen Rezept -----------*/
  async getRandomRecipe(): Promise<void> {
    try {
      const response = await this.apiService.getRandomRecipeId();
      this._snackBar.open('Viel Spaß mit dem zufälligen Rezept', 'x', {
        duration: 2000
      });
      await this.router.navigate(['/recipe-view'], {
        queryParams: { selectedRecipe: response.id, author: response.author },
        queryParamsHandling: 'merge'
      });

    } catch (error) {
      console.error('Fehler beim aussuchen eines zufalls Rezepts', error);
      this._snackBar.open('Fehler beim Aussuchen eines zufälligen Rezepts', 'x', {
        duration: 2000
      });

      const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
      if (snackBarElement) {
        (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
      }
      await this.router.navigate(['/']);
    }
  }
}
