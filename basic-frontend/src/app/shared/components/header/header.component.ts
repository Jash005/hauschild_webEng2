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

  logout() {
    localStorage.removeItem('username');
    localStorage.setItem('snackbarMessage', 'User erfolgreich ausgeloggt');
    window.location.replace('/');
  }
}
