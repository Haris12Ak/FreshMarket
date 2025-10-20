import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientViewComponent } from './dashboard-client-view.component';

describe('DashboardClientViewComponent', () => {
  let component: DashboardClientViewComponent;
  let fixture: ComponentFixture<DashboardClientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClientViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
