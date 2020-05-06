import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
    constructor(private _snackBar: MatSnackBar) {}

    openSnackBar(message: string, duration: number) {
      this._snackBar.open(message, 'Close', {
        duration,
      });
    }
}
