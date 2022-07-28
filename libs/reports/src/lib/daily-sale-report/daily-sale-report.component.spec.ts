import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySaleReportComponent } from './daily-sale-report.component';

describe('DailySaleReportComponent', () => {
  let component: DailySaleReportComponent;
  let fixture: ComponentFixture<DailySaleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailySaleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
