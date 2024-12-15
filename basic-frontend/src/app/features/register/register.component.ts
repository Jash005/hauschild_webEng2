import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  /* ----------- Initialisierung -----------*/
  private _snackBar = inject(MatSnackBar);
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,20}$')]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }


  /* ----------- API-Aufruf zum Registrieren eines Benutzers -----------*/
  async submitForm(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        await this.apiService.registerUser(this.registerForm.value);
        localStorage.setItem('snackbarMessage', 'User erfolgreich registriert');
        window.location.replace('/login');
      } catch (error) {
        console.error('Fehler bei der Registrierung', error);
        const errorMessage = (error as any).message || 'Fehler bei der Registrierung';
        this._snackBar.open(errorMessage, 'x', { duration: 2000 });
        const snackBarElement = document.querySelector(".mat-mdc-snackbar-surface");
        if (snackBarElement) {
          (snackBarElement as HTMLElement).style.backgroundColor = '#f00';
        }
      }
    }
  }
}
