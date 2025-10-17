import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ClientInsertRequest } from '../../../model/requests/ClientInsertRequest';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';
import { CompanyInfo } from '../../../model/CompanyInfo';
import Swal from 'sweetalert2';
import { ValidatorService } from '../../../services/validator.service';
import { MyErrorStateMatcher } from '../../../helper/error_state_matcher';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.css'
})
export class ClientAddComponent {

  addClientForms: FormGroup;
  clientInsert: ClientInsertRequest | null = null;
  company: CompanyInfo | null = null;

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private formBuilder: FormBuilder, private companyService: CompanyService, private validatorService: ValidatorService) {
    this.addClientForms = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      firstName: ['', [Validators.required, Validators.pattern(this.validatorService.namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.validatorService.namePattern)]],
      phone: ['', [Validators.pattern(this.validatorService.phonePattern)]],
    });
  }

  ngOnInit(): void {
    this.companyService.companyInfo$.subscribe(data => {
      this.company = data;
    });
  }

  cancel() {
    this.router.navigate(['/main-page/clients']);
  }

  onSubmit() {
    if (this.addClientForms.valid) {
      const formValues = this.addClientForms.value;

      const newClient = new ClientInsertRequest(
        formValues.email,
        formValues.firstName,
        formValues.lastName,
        formValues.phone,
      );

      this.companyService.AddClientToCompany('AddClientToCompany', this.company!.companyId, newClient)
        .subscribe({
          next: response => {
            Swal.fire({
              icon: 'success',
              title: 'New client added successfully!',
              confirmButtonText: 'OK',
              confirmButtonColor: 'green',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then(result => {
              if (result.isConfirmed) {
                this.router.navigate(['/main-page/clients']);
                this.addClientForms.reset();
              }
            });
          },
          error: error => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to add new client!',
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
