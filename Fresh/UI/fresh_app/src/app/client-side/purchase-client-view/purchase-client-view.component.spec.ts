import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseClientViewComponent } from './purchase-client-view.component';

describe('PurchaseClientViewComponent', () => {
  let component: PurchaseClientViewComponent;
  let fixture: ComponentFixture<PurchaseClientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseClientViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
