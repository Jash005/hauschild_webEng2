import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);
  loginForm: FormGroup;
  hide = signal(true);

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  async submitForm(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        const response = await this.apiService.loginUser(this.loginForm.value);
        console.log('User erfolgreich eingeloggt', response);
        localStorage.setItem("username", this.loginForm.value.username);
        localStorage.setItem('snackbarMessage', 'User erfolgreich eingeloggt');
        window.location.replace('/');
      } catch (error) {
        console.error('Fehler beim Login', error);
        this._snackBar.open('Username oder Passwort falsch', 'x', {
          duration: 151551500
        });

        const snackBarElement = document.querySelector(".mat-mdc-simple-snack-bar");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      }
    }
  }
}
