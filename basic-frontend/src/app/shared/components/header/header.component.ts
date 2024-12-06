import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _snackBar = inject(MatSnackBar);
  username = localStorage.getItem('username');
  userId = localStorage.getItem('userId');

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.setItem('snackbarMessage', 'User erfolgreich ausgeloggt');
    window.location.replace('/');
  }
}
