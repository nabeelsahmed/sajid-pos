import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletTableComponent } from './outlet-table.component';

describe('OutletTableComponent', () => {
  let component: OutletTableComponent;
  let fixture: ComponentFixture<OutletTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
