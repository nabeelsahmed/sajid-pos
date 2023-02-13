import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BachatFooterComponent } from './bachat-footer.component';

describe('BachatFooterComponent', () => {
  let component: BachatFooterComponent;
  let fixture: ComponentFixture<BachatFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BachatFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BachatFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
