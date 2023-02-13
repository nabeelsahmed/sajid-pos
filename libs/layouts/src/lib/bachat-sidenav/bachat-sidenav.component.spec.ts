import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BachatSidenavComponent } from './bachat-sidenav.component';

describe('BachatSidenavComponent', () => {
  let component: BachatSidenavComponent;
  let fixture: ComponentFixture<BachatSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BachatSidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BachatSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
