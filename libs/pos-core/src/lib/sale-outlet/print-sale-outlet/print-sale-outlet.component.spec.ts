import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSaleOutletComponent } from './print-sale-outlet.component';

describe('PrintSaleOutletComponent', () => {
  let component: PrintSaleOutletComponent;
  let fixture: ComponentFixture<PrintSaleOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSaleOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSaleOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
