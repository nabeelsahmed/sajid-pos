import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutStockReportComponent } from './in-out-stock-report.component';

describe('InOutStockReportComponent', () => {
  let component: InOutStockReportComponent;
  let fixture: ComponentFixture<InOutStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InOutStockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InOutStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
