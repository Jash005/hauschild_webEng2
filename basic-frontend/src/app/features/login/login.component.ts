import { Component, signal, inject } from '@angular/core';
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
/* ----------- Initalisierung -----------*/
  private _snackBar = inject(MatSnackBar);
  loginForm: FormGroup;
  hide = signal(true);

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


/* ----------- Auth-Headers -----------*/
  private createAuthHeader(username: string, password: string): string {
    const creds = `${username}:${password}`;
    const encoded = btoa(creds);
    return `Basic ${encoded}`;
  }


/* ----------- API Aufruf zum Login -----------*/
  async submitForm(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        const response = await this.apiService.loginUser(this.loginForm.value);
        localStorage.setItem("username", this.loginForm.value.username);
        localStorage.setItem("userId", response.user._id);
        localStorage.setItem("authToken", this.createAuthHeader(this.loginForm.value.username, this.loginForm.value.password));
        localStorage.setItem('snackbarMessage', 'User erfolgreich eingeloggt');
        window.location.replace('/');
      } catch (error) {
        console.error('Fehler beim Login', error);
        this._snackBar.open('Username oder Passwort falsch', 'x', {
          duration: 2000
        });

        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      }
    }
  }
}
