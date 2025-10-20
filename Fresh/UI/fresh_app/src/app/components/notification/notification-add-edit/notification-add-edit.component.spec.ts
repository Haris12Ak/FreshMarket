import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAddEditComponent } from './notification-add-edit.component';

describe('NotificationAddEditComponent', () => {
  let component: NotificationAddEditComponent;
  let fixture: ComponentFixture<NotificationAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
