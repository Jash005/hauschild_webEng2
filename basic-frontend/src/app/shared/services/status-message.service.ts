import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private _snackBar = inject(MatSnackBar);

  constructor() { }

  setTriggerSnackbar() {
    const snackbarMessage = localStorage.getItem('snackbarMessage');
    if (snackbarMessage !== null) {
      this._snackBar.open(snackbarMessage, 'x', {duration: 2000});
      localStorage.removeItem('snackbarMessage');
    }
  }
}
