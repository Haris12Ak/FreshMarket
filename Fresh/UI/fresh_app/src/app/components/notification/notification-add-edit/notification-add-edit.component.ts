import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NotificationUpdateRequest } from '../../../model/requests/NotificationUpdateRequest';
import { NotificationInsertRequest } from '../../../model/requests/NotificationInsertRequest';
import { MyErrorStateMatcher } from '../../../helper/error_state_matcher';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../model/Notification';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-add-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './notification-add-edit.component.html',
  styleUrl: './notification-add-edit.component.css'
})
export class NotificationAddEditComponent {
  companyId: number;
  addNotificationForms!: FormGroup;
  notificationId?: number;
  isEdit = false;
  notification: Notification | null = null;

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private notificationService: NotificationService) {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
  }

  ngOnInit(): void {
    this.addNotificationForms = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.notificationId = Number(this.route.snapshot.paramMap.get('notificationId'));

    if (this.notificationId) {
      this.isEdit = true;
      this.getNotificationById();
    }
  }

  cancel() {
    this.router.navigate(['main-page/notification']);
  }

  getNotificationById() {
    this.notificationService.getById(this.companyId, this.notificationId!)
      .subscribe(data => {
        this.notification = data;

        this.addNotificationForms.patchValue({
          title: this.notification!.title,
          content: this.notification!.content
        });
      });
  }

  onSubmit() {
    if (!this.addNotificationForms.valid)
      return;

    const formValues = this.addNotificationForms.value;

    if (!this.isEdit) {
      const newNotification = new NotificationInsertRequest(
        formValues.title,
        formValues.content,
      );

      this.notificationService.insert('Insert', this.companyId, newNotification)
        .subscribe({
          next: response => {
            this.showDialog('success', 'Notification added successfully', 'green')
              .then(result => {
                if (result.isConfirmed) {
                  this.router.navigate(['/main-page/notification']);
                  this.addNotificationForms.reset();
                }
              });
          },
          error: error => {
            this.showDialog('warning', 'Failed to add new notification!', 'grey');
          }
        });

    } else if (this.isEdit) {
      const editNotification = new NotificationUpdateRequest(
        formValues.title,
        formValues.content,
      );

      this.notificationService.update(this.companyId, this.notificationId!, editNotification)
        .subscribe({
          next: response => {
            this.showDialog('success', 'Notification successfully edited', 'green')
              .then(result => {
                if (result.isConfirmed) {
                  this.router.navigate(['/main-page/notification']);
                  this.addNotificationForms.reset();
                }
              });
          },
          error: error => {
            this.showDialog('warning', 'Failed to edit notification!', 'grey');
          }
        });
    }
  }

  private showDialog(icon: SweetAlertIcon, content: string, confirmButtonColor: string) {
    return Swal.fire({
      icon: icon,
      title: content,
      confirmButtonText: 'OK',
      confirmButtonColor: confirmButtonColor,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
}
