import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationClientViewComponent } from './notification-client-view.component';

describe('NotificationClientViewComponent', () => {
  let component: NotificationClientViewComponent;
  let fixture: ComponentFixture<NotificationClientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationClientViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
