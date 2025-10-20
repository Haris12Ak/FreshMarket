import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsClientViewComponent } from './products-client-view.component';

describe('ProductsClientViewComponent', () => {
  let component: ProductsClientViewComponent;
  let fixture: ComponentFixture<ProductsClientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsClientViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
