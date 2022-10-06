import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOutletComponent } from './sale-outlet.component';

describe('SaleOutletComponent', () => {
  let component: SaleOutletComponent;
  let fixture: ComponentFixture<SaleOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
