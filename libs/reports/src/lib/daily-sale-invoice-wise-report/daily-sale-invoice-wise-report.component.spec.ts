import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySaleInvoiceWiseReportComponent } from './daily-sale-invoice-wise-report.component';

describe('DailySaleInvoiceWiseReportComponent', () => {
  let component: DailySaleInvoiceWiseReportComponent;
  let fixture: ComponentFixture<DailySaleInvoiceWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySaleInvoiceWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySaleInvoiceWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
