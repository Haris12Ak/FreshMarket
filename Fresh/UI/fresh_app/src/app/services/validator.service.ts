import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  public namePattern: string = '^[A-Z][a-z]{2,}$';
  public phonePattern: string = '^\\+?[0-9]{9,15}$';

  constructor() { }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.get(password);
      const confirm = formGroup.get(confirmPassword);

      if (pass && confirm && pass.value != confirm.value) {
        confirm.setErrors({ mustMatch: true });
      } else {
        confirm?.setErrors(null);
      }
    };
  }
}
