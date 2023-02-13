import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySaleProductWiseReportComponent } from './daily-sale-product-wise-report.component';

describe('DailySaleProductWiseReportComponent', () => {
  let component: DailySaleProductWiseReportComponent;
  let fixture: ComponentFixture<DailySaleProductWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySaleProductWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySaleProductWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
