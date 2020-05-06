import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
    constructor(private _snackBar: MatSnackBar) {}

    openSnackBar(message: string) {
      this._snackBar.open(message, 'Close', {
        duration: 3000,
      });
    }
}
