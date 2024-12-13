import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import {MatFabAnchor} from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatTooltip,
    MatFabAnchor
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
/* ----------- Initialisierung -----------*/
  private _snackBar = inject(MatSnackBar);
  username = localStorage.getItem('username');
  userId = localStorage.getItem('userId');

  constructor(private router: Router, private route: ActivatedRoute) { }


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
    this.router.navigate(['/userprofil'], { queryParams: { selectedUser: this.userId } }).then(() => {
      window.location.reload();
    });
  }
}
