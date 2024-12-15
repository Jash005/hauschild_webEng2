import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatTooltip],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  /* ----------- Initialisierung -----------*/
  username = localStorage.getItem('username');
  userId = localStorage.getItem('userId');

  constructor(private router: Router ) { }

  /* ----------- Logout ----------- */
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.setItem('snackbarMessage', 'User erfolgreich ausgeloggt');
    window.location.replace('/');
  }

  /* ----------- zum Userprofil navigieren ----------- */
  navigateAndReload(): void {
    this.router
      .navigate(['/userprofil'], { queryParams: { selectedUser: this.userId } })
      .then(() => {
        window.location.reload();
      });
  }
}
