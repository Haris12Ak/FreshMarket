import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClientDetailsComponent } from './product-client-details.component';

describe('ProductClientDetailsComponent', () => {
  let component: ProductClientDetailsComponent;
  let fixture: ComponentFixture<ProductClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductClientDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
