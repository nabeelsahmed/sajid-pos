import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpClOutletReportComponent } from './op-cl-outlet-report.component';

describe('OpClOutletReportComponent', () => {
  let component: OpClOutletReportComponent;
  let fixture: ComponentFixture<OpClOutletReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpClOutletReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpClOutletReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
