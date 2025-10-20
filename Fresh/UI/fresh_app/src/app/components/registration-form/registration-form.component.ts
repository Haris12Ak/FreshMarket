import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyRegistration } from '../../model/requests/CompanyRegistration';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { ValidatorService } from '../../services/validator.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.css'
})
export class RegistrationFormComponent {

  companyRegistration!: CompanyRegistration;
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private companyService: CompanyService, private validatorService: ValidatorService) {
    this.registerForm = this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.minLength(3)]],
      companyAddress: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      firstName: ['', [Validators.required, Validators.pattern(this.validatorService.namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.validatorService.namePattern)]],
      phone: ['', [Validators.pattern(this.validatorService.phonePattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.validatorService.matchPasswords('password', 'confirmPassword')
    });
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      const newCompanyRegistration = new CompanyRegistration(
        formValues.companyName,
        formValues.companyAddress,
        formValues.username,
        formValues.email,
        formValues.firstName,
        formValues.lastName,
        formValues.phone,
        formValues.password,
        formValues.confirmPassword
      );

      this.companyService.RegisterCompany("register", newCompanyRegistration)
        .subscribe({
          next: response => {

            Swal.fire({
              icon: 'success',
              title: 'Successful registration!',
              text: 'You have successfully registered your company and your account. You can now access the application with your login details.',
              confirmButtonText: 'OK',
              confirmButtonColor: 'green',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(result => {
              if (result.isConfirmed) {
                this.router.navigate(['/']);
                this.registerForm.reset();
              }
            });
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'There was a problem creating the company.',
              confirmButtonText: 'OK',
              confirmButtonColor: 'grey',
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }

        });
    }
  }
}
