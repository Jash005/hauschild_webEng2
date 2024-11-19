import { Component, ChangeDetectionStrategy, signal} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from "../../shared/services/api.service";
import { Router } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  readonly username = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  readonly acceptTerms = new FormControl('', [Validators.requiredTrue]);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }


  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('dieses Feld ist erforderlich');
    } else {
      this.errorMessage.set('');
    }
  }

  async submitForm(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        const response = await this.apiService.registerUser(this.registerForm.value);
        console.log('User erfolgreich registriert', response);
        this._snackBar.open('User erfolgreich registriert', 'x', { duration: 2000 });
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Fehler bei der Registrierung', error);
        this._snackBar.open('Fehler bei der Registrierung', 'x', { duration: 2000 });
      }
    }
  }
}
