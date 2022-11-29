import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalPriceConfigComponent } from './portal-price-config.component';

describe('PortalPriceConfigComponent', () => {
  let component: PortalPriceConfigComponent;
  let fixture: ComponentFixture<PortalPriceConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalPriceConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPriceConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
