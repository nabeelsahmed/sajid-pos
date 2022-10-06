import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleOutletTableComponent } from './product-sale-outlet-table.component';

describe('ProductSaleOutletTableComponent', () => {
  let component: ProductSaleOutletTableComponent;
  let fixture: ComponentFixture<ProductSaleOutletTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSaleOutletTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSaleOutletTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
